import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'challenge_approval_request' | 'challenge_approved' | 'challenge_declined' | 'general'
  is_read: boolean
  created_at: string
  metadata?: {
    challenge_id?: string
    submission_id?: string
    requester_name?: string
  }
}

export interface Submission {
  id: string
  user_id: string
  challenge_id: string
  content: string
  status: 'pending' | 'approved' | 'declined'
  created_at: string
}

// Enhanced error handling utility
const handleError = (operation: string, error: any) => {
  console.error(`Error in ${operation}:`, error)
  
  // Log additional context for debugging
  if (error?.code) {
    console.error(`Supabase error code: ${error.code}`)
  }
  if (error?.details) {
    console.error(`Error details: ${error.details}`)
  }
  if (error?.hint) {
    console.error(`Error hint: ${error.hint}`)
  }
  
  return {
    success: false,
    error: error?.message || 'An unexpected error occurred',
    code: error?.code || 'UNKNOWN_ERROR'
  }
}

// ==================== SUBMISSION FUNCTIONS ====================

/**
 * Submit a challenge for approval
 */
export const submitChallenge = async (
  userId: string,
  challengeId: string,
  content: string,
  requesterName: string
) => {
  try {
    // Input validation
    if (!userId || !challengeId || !content.trim() || !requesterName) {
      throw new Error('Missing required fields for challenge submission')
    }

    console.log("Submitting challenge:", { userId, challengeId, content: content.substring(0, 50) + '...' })

    // 1. Insert submission
    const { data: submission, error: submissionError } = await supabase
      .from('submissions2')
      .insert([
        {
          user_id: userId,
          challenge_id: challengeId,
          content: content.trim(),
          status: 'pending'
        }
      ])
      .select()
      .single()

    if (submissionError) throw submissionError

    // 2. Get challenge details
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('title')
      .eq('id', challengeId)
      .single()

    if (challengeError) throw challengeError

    if (!challenge) {
      throw new Error('Challenge not found')
    }

    // 3. Find seniors with better error handling
    const { data: seniors, error: seniorsError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'senior')

    if (seniorsError) {
      console.warn('Error finding seniors:', seniorsError)
      // Continue without notifications rather than failing completely
    }

    // 4. Create notifications for all seniors
    const notifications = seniors?.map(senior => ({
      user_id: senior.id,
      title: 'New Challenge Approval Request',
      message: `${requesterName} has submitted "${challenge.title}" for approval`,
      type: 'challenge_approval_request' as const,
      is_read: false,
      metadata: {
        challenge_id: challengeId,
        submission_id: submission.id,
        requester_name: requesterName
      }
    })) || []

    if (notifications.length > 0) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications)

      if (notificationError) {
        console.warn('Failed to create notifications:', notificationError)
        // Don't fail the entire operation if notifications fail
      }
    } else {
      console.warn('No seniors found to notify')
    }

    console.log('Challenge submitted successfully:', submission.id)
    return { success: true, submission, data: submission }
  } catch (error) {
    return handleError('submitChallenge', error)
  }
}

/**
 * Approve or decline a submission
 */
export const approveOrDeclineSubmission = async (
  submissionId: string,
  status: 'approved' | 'declined',
  reviewerId: string,
  reviewerName: string
) => {
  try {
    // Input validation
    if (!submissionId || !status || !reviewerId || !reviewerName) {
      throw new Error('Missing required fields for submission review')
    }

    if (!['approved', 'declined'].includes(status)) {
      throw new Error('Invalid status. Must be "approved" or "declined"')
    }

    console.log(`Processing submission ${submissionId} as ${status} by ${reviewerName}`)

    // 1. Update submission status
    const { data: submission, error: updateError } = await supabase
      .from('submissions2')
      .update({ status })
      .eq('id', submissionId)
      .select(`
        *,
        challenges(title)
      `)
      .single()

    if (updateError) throw updateError

    if (!submission) {
      throw new Error('Submission not found')
    }

    // 2. Create notification for the original submitter
    const notificationTitle = status === 'approved' 
      ? 'Challenge Approved!' 
      : 'Challenge Needs Revision'
    
    const notificationMessage = status === 'approved'
      ? `Great job! Your "${submission.challenges.title}" challenge has been approved by ${reviewerName} 🎉`
      : `Your "${submission.challenges.title}" challenge needs some revisions. Please check the feedback and resubmit.`

    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: submission.user_id,
          title: notificationTitle,
          message: notificationMessage,
          type: status === 'approved' ? 'challenge_approved' : 'challenge_declined',
          is_read: false,
          metadata: {
            challenge_id: submission.challenge_id,
            submission_id: submissionId
          }
        }
      ])

    if (notificationError) {
      console.warn('Failed to create notification:', notificationError)
      // Continue without failing the approval
    }

    // 3. Optional: Send email notification (fire and forget)
    try {
      await sendEmailNotification(
        submission.user_id,
        notificationTitle,
        notificationMessage
      )
    } catch (emailError) {
      console.warn('Failed to send email notification:', emailError)
      // Don't fail the operation if email fails
    }

    console.log(`Submission ${submissionId} ${status} successfully`)
    return { success: true, submission, data: submission }
  } catch (error) {
    return handleError('approveOrDeclineSubmission', error)
  }
}

// ==================== NOTIFICATION FUNCTIONS ====================

/**
 * Get user notifications with enhanced error handling
 */
export const getUserNotifications = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error
    
    console.log(`Retrieved ${data?.length || 0} notifications for user ${userId}`)
    return { success: true, data: data || [] }
  } catch (error) {
    const result = handleError('getUserNotifications', error)
    return { ...result, data: [] }
  }
}

/**
 * Get unread notification count with enhanced error handling
 */
export const getUnreadNotificationCount = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const { count, error } = await supabase
      .from('notifications')
      .select('', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error
    
    const unreadCount = count || 0
    console.log(`User ${userId} has ${unreadCount} unread notifications`)
    return { success: true, count: unreadCount }
  } catch (error) {
    const result = handleError('getUnreadNotificationCount', error)
    return { ...result, count: 0 }
  }
}

/**
 * Mark notification as read with enhanced error handling
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    if (!notificationId) {
      throw new Error('Notification ID is required')
    }

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) throw error
    
    console.log(`Marked notification ${notificationId} as read`)
    return { success: true }
  } catch (error) {
    return handleError('markNotificationAsRead', error)
  }
}

/**
 * Subscribe to real-time notifications with error handling
 */
export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
  if (!userId) {
    console.error('Cannot subscribe to notifications: User ID is required')
    return { unsubscribe: () => {} }
  }

  console.log(`Subscribing to notifications for user ${userId}`)
  
  return supabase
    .channel(`notifications-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Real-time notification received:', payload)
        callback(payload)
      }
    )
    .subscribe((status) => {
      console.log('Subscription status:', status)
    })
}

// ==================== APPROVAL FUNCTIONS ====================

/**
 * Get pending approval requests for seniors
 */
export const getPendingApprovals = async (reviewerId: string) => {
  try {
    if (!reviewerId) {
      throw new Error('Reviewer ID is required')
    }

    const { data, error } = await supabase
      .from('submissions2')
      .select(`
        *,
        challenges(title, difficulty),
        user_profiles(name, avatar_url)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    
    console.log(`Retrieved ${data?.length || 0} pending approvals`)
    return { success: true, data: data || [] }
  } catch (error) {
    const result = handleError('getPendingApprovals', error)
    return { ...result, data: [] }
  }
}

// ==================== EMAIL NOTIFICATION (Optional) ====================

/**
 * Send email notification using Supabase Edge Functions
 */
export const sendEmailNotification = async (
  userId: string,
  subject: string,
  message: string
) => {
  try {
    if (!userId || !subject || !message) {
      throw new Error('Missing required email parameters')
    }

    // First get user email
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('email, name')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    if (!user?.email) {
      console.log(`No email found for user ${userId}`)
      return { success: false, error: 'User email not found' }
    }

    // Call Supabase Edge Function for sending email
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: user.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #22C55E;">Hello ${user.name}!</h2>
            <p>${message}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                This is an automated message from your Challenge Management System.
              </p>
            </div>
          </div>
        `
      }
    })

    if (error) throw error
    
    console.log(`Email sent successfully to ${user.email}`)
    return { success: true, data }
  } catch (error) {
    return handleError('sendEmailNotification', error)
  }
}