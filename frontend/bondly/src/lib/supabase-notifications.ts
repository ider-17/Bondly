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
    // 1. Create submission
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert([
        {
          user_id: userId,
          challenge_id: challengeId,
          content: content,
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

    // 3. Find seniors (you might need to adjust this query based on your user roles)
    const { data: seniors, error: seniorsError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'senior') // Assuming you have a role field

    if (seniorsError || !seniors) {
      console.error('Error finding seniors:', seniorsError)
      // Fallback: you can hardcode senior IDs or use a different method
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

      if (notificationError) throw notificationError
    }

    return { success: true, submission }
  } catch (error) {
    console.error('Error submitting challenge:', error)
    return { success: false, error }
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
    // 1. Update submission status
    const { data: submission, error: updateError } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', submissionId)
      .select(`
        *,
        challenges(title)
      `)
      .single()

    if (updateError) throw updateError

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

    if (notificationError) throw notificationError

    // 3. Optional: Send email notification
    await sendEmailNotification(
      submission.user_id,
      notificationTitle,
      notificationMessage
    )

    return { success: true, submission }
  } catch (error) {
    console.error('Error updating submission:', error)
    return { success: false, error }
  }
}

// ==================== NOTIFICATION FUNCTIONS ====================

/**
 * Get user notifications
 */
export const getUserNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return { success: false, error, data: [] }
  }
}

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount = async (userId: string) => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error
    return { success: true, count: count || 0 }
  } catch (error) {
    console.error('Error fetching unread count:', error)
    return { success: false, count: 0 }
  }
}

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { success: false, error }
  }
}

/**
 * Subscribe to real-time notifications
 */
export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}

// ==================== APPROVAL FUNCTIONS ====================

/**
 * Get pending approval requests for seniors
 */
export const getPendingApprovals = async (reviewerId: string) => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        challenges(title, difficulty),
        user_profiles(name, avatar_url)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching pending approvals:', error)
    return { success: false, data: [] }
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
    // First get user email
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('email, name')
      .eq('id', userId)
      .single()

    if (userError || !user?.email) {
      console.log('No email found for user')
      return { success: false }
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
    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}