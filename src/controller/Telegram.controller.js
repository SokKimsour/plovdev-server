const { JobListing } = require('../models')
const parseTelegramJob = require('../utils/parseTelegramJob')

const handleTelegramWebhook = async (req, res) => {

  // RULE 1 — Always respond 200 to Telegram first.
  // Telegram waits for your response. If it does not get
  // one within a few seconds, it assumes the delivery failed
  // and sends the same message again. This means the same
  // job could be inserted into your database multiple times.
  // Sending 200 immediately tells Telegram "received, thank you"
  // and stops any retry attempts.
  res.sendStatus(200)

  try {
    const body = req.body

    // Telegram sends many types of updates.
    // We only care about regular text messages.
    // If there is no message or no text, we stop here silently.
    const message = body?.message
    if (!message || !message.text) return

    const text = message.text

    // RULE 2 — Ignore slash commands like /start or /help.
    // When an HR rep first opens the bot, Telegram automatically
    // sends /start as a message. We do not want to try parsing
    // "/start" as a job listing. It would fail and produce garbage data.
    if (text.startsWith('/')) return

    // Pass the raw message text to our parser.
    // The parser returns a clean structured object ready for the database.
    const jobData = parseTelegramJob(text)

    // Save to the database.
    // Status defaults to 'pending review' inside the parser.
    // The admin will see this on the dashboard and approve or reject it.
    await JobListing.create(jobData)

    console.log(`[Telegram Bot] New job saved: ${jobData.title} at ${jobData.company_name}`)

  } catch (error) {
    // We catch errors here but we do NOT send an error response.
    // We already sent 200 above. We just log it for debugging.
    console.error('[Telegram Webhook Error]', error.message)
  }
}

module.exports = { handleTelegramWebhook }