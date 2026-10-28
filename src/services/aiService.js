import { activeParkingSession } from '../data/mockData';

// System prompt grounding the local model (Qwen / Ollama) in Parkwise domain knowledge
const SYSTEM_PROMPT = `You are "Parkwise AI", an intelligent, polite, and helpful assistant for the Parkwise Smart Parking & Secure Vehicle Retrieval System.
Your job is to answer user doubts, provide clear explanations, assist with vehicle locations, explain tariffs, and guide users through security procedures.

CURRENT ACTIVE SESSION CONTEXT FOR THE USER:
- Vehicle: ${activeParkingSession.vehicleModel} (${activeParkingSession.vehicleNumber})
- Vehicle Type: ${activeParkingSession.vehicleType}
- Parking Slot: ${activeParkingSession.parkingSlot} located in ${activeParkingSession.zone}
- Ingress Gate: ${activeParkingSession.entryGate}
- Entry Time: ${activeParkingSession.formattedEntryTime} (Parked for ~2 hours 25 minutes)
- Tariff Rate: ₹${activeParkingSession.hourlyRate}/hour
- Current Accrued Fee: ₹${activeParkingSession.currentFee}
- Assigned Exit Gate: ${activeParkingSession.exitGateAssigned}
- RFID Tag Status: ${activeParkingSession.rfidStatus}

SYSTEM CAPABILITIES & POLICIES:
1. Vehicle Location: Drivers can track their slot telemetry and spatial location in Zone A.
2. Fee & Payments: Users can pay accumulated fees online via UPI QR, RuPay/Cards, or digital wallets.
3. Lost Token Recovery: A 4-step secure workflow using Multi-Factor Authentication (OTP challenge to registered mobile) generates a temporary digital pass without manual operator queues.
4. Delegated Vehicle Retrieval: An owner can authorize a friend or relative to retrieve their vehicle with a time-bound single-use QR and OTP pass.
5. Strict Security Decoupling: Parkwise AI explains policies and helps users, but NEVER directly releases the gate barrier or overrides physical security without MFA verification.

RESPONSE GUIDELINES:
- Keep answers concise, clear, and direct (2 to 4 sentences).
- Use bullet points when explaining multi-step procedures.
- When answering doubts, be informative and friendly.
- Do not make up fake gate codes or passwords.`;

class AIService {
  constructor() {
    this.modelName = null;
    this.isOllamaOnline = false;
    this.availableModels = [];
    this.conversationHistory = [];
    this.checkConnection();
  }

  // Detect Ollama status and pick preferred model (Qwen preferred)
  async checkConnection() {
    try {
      const endpoints = ['/ollama/api/tags', 'http://127.0.0.1:11434/api/tags'];
      let res = null;

      for (const endpoint of endpoints) {
        try {
          const testRes = await fetch(endpoint, { method: 'GET', signal: AbortSignal.timeout(2000) });
          if (testRes.ok) {
            res = await testRes.json();
            break;
          }
        } catch (e) {
          // try next
        }
      }

      if (res && res.models && res.models.length > 0) {
        this.availableModels = res.models.map(m => m.name);
        this.isOllamaOnline = true;

        // Prefer any model with 'qwen' in its name
        const qwenModel = this.availableModels.find(name => name.toLowerCase().includes('qwen'));
        if (qwenModel) {
          this.modelName = qwenModel;
        } else {
          // Fallback to first available model (e.g. llama3.2:3b)
          this.modelName = this.availableModels[0];
        }
        return { online: true, model: this.modelName, models: this.availableModels };
      }
    } catch (err) {
      console.warn('Ollama not reachable, using heuristic response fallback:', err.message);
    }

    this.isOllamaOnline = false;
    this.modelName = 'Local Fallback Engine';
    return { online: false, model: this.modelName, models: [] };
  }

  getModelInfo() {
    return {
      online: this.isOllamaOnline,
      model: this.modelName || 'Detecting...',
      models: this.availableModels
    };
  }

  setModel(model) {
    if (this.availableModels.includes(model)) {
      this.modelName = model;
    }
  }

  // Process incoming user query
  async processQuery(queryText) {
    await this.checkConnection();

    // 1. Try querying local Ollama model if available
    if (this.isOllamaOnline && this.modelName) {
      try {
        console.log(`🤖 [Parkwise AI] Sending query to local model (${this.modelName})...`);
        const result = await this.queryOllama(queryText);
        if (result && result.reply) {
          console.log(`✅ [Parkwise AI] Received response from ${this.modelName}:`, result.reply);
          return this.attachContextAndActions(queryText, result.reply, `Local Model: ${this.modelName} (Ollama)`);
        }
      } catch (err) {
        console.error('❌ [Parkwise AI] Local LLM query failed, falling back:', err);
      }
    }

    console.warn('⚠️ [Parkwise AI] Ollama offline or unavailable, using Rule Engine fallback.');
    // 2. Heuristic fallback engine if Ollama is not running or model fails
    return this.heuristicFallback(queryText);
  }

  async queryOllama(queryText) {
    // Maintain rolling context of last 4 messages
    this.conversationHistory.push({ role: 'user', content: queryText });
    if (this.conversationHistory.length > 8) {
      this.conversationHistory = this.conversationHistory.slice(-8);
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...this.conversationHistory
    ];

    const endpoints = ['/ollama/api/chat', 'http://localhost:11434/api/chat', 'http://127.0.0.1:11434/api/chat'];
    let replyText = null;
    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.modelName,
            messages: messages,
            stream: false,
            options: {
              temperature: 0.6,
              num_predict: 250
            }
          }),
          signal: AbortSignal.timeout(20000)
        });

        if (response.ok) {
          const data = await response.json();
          replyText = data.message?.content?.trim();
          if (replyText) {
            this.conversationHistory.push({ role: 'assistant', content: replyText });
            break;
          }
        } else {
          lastError = new Error(`HTTP ${response.status} from ${endpoint}`);
        }
      } catch (e) {
        lastError = e;
      }
    }

    if (!replyText) {
      throw lastError || new Error('No response from Ollama API');
    }

    return { reply: replyText };
  }

  // Detect relevant intent and attach actionable navigation cards & deep links
  attachContextAndActions(queryText, llmReply, engineLabel) {
    const lower = queryText.toLowerCase();

    // Intent: Lost Token / Recovery
    if (lower.includes('lost') || lower.includes('misplaced') || (lower.includes('token') && lower.includes('where'))) {
      return {
        reply: llmReply,
        intent: 'LOST_TOKEN_RECOVERY',
        engine: engineLabel,
        actionCard: {
          type: 'recovery',
          title: 'Lost Token Recovery Portal',
          status: 'Awaiting MFA Verification',
          actionUrl: '/user/recovery',
          actionLabel: 'Launch Secure Recovery Workflow',
          metadata: {
            vehicle: activeParkingSession.vehicleNumber,
            session: activeParkingSession.sessionId,
            slot: activeParkingSession.parkingSlot,
          }
        },
        pipeline: `${engineLabel} → Multi-Factor Identity Challenge → Temporary Pass Credential`,
        suggestions: ['How does OTP verification work?', 'Can I delegate vehicle pickup?']
      };
    }

    // Intent: Vehicle location / slot
    if (lower.includes('where') || lower.includes('slot') || lower.includes('parked') || lower.includes('location') || lower.includes('bike') || lower.includes('car')) {
      return {
        reply: llmReply,
        intent: 'LOCATE_VEHICLE',
        engine: engineLabel,
        actionCard: {
          type: 'location',
          title: `Parked at ${activeParkingSession.parkingSlot}`,
          status: 'Active & Secure',
          actionUrl: '/user/parking',
          actionLabel: 'View Live Bay Telemetry',
          metadata: {
            slot: activeParkingSession.parkingSlot,
            gate: activeParkingSession.entryGate,
            entry: activeParkingSession.formattedEntryTime,
          }
        },
        pipeline: `${engineLabel} → Sensor Telemetry Query → Real-Time Spatial Index`,
        suggestions: ['How much is my fee?', 'View my digital QR token']
      };
    }

    // Intent: Tariff / Fees / Payment
    if (lower.includes('fee') || lower.includes('cost') || lower.includes('charge') || lower.includes('pay') || lower.includes('amount') || lower.includes('rate')) {
      return {
        reply: llmReply,
        intent: 'PARKING_FEE_INQUIRY',
        engine: engineLabel,
        actionCard: {
          type: 'payment',
          title: `Current Due: ₹${activeParkingSession.currentFee}`,
          status: 'Payment Pending',
          actionUrl: '/user/payments',
          actionLabel: 'Pay Now via UPI / Card',
          metadata: {
            duration: '2h 25m',
            rate: `₹${activeParkingSession.hourlyRate}/hour`,
            amount: `₹${activeParkingSession.currentFee}`
          }
        },
        pipeline: `${engineLabel} → Tariff Duration Engine → Settled Ledger Matrix`,
        suggestions: ['Pay via UPI QR', 'Who can collect my vehicle?']
      };
    }

    // Intent: Delegation / Friend pickup
    if (lower.includes('friend') || lower.includes('delegate') || lower.includes('brother') || lower.includes('relative') || lower.includes('someone else') || lower.includes('pickup')) {
      return {
        reply: llmReply,
        intent: 'DELEGATE_RETRIEVAL',
        engine: engineLabel,
        actionCard: {
          type: 'delegation',
          title: 'Delegated Vehicle Retrieval',
          status: 'Ready to Authorize',
          actionUrl: '/user/delegation',
          actionLabel: 'Create Proxy Authorization',
          metadata: {
            vehicle: activeParkingSession.vehicleNumber,
            maxValidity: 'Up to 6 hours',
          }
        },
        pipeline: `${engineLabel} → Role-Based Delegation Policy → Time-Bound Credential Factory`,
        suggestions: ['View active delegations', 'How does proxy pickup work?']
      };
    }

    // Intent: General Doubt / Explanation / FAQ
    return {
      reply: llmReply,
      intent: 'EXPLANATION_AND_DOUBTS',
      engine: engineLabel,
      actionCard: null,
      pipeline: `${engineLabel} → Parkwise Domain Knowledge Base → Responsive Answer`,
      suggestions: [
        'Where is my bike parked?',
        'How much is my fee?',
        'I lost my parking token.',
        'How does delegated retrieval work?'
      ]
    };
  }

  // Heuristic engine fallback when offline
  async heuristicFallback(queryText) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    const lower = queryText.toLowerCase();

    if (lower.includes('lost') || lower.includes('token') && (lower.includes('misplaced') || lower.includes('lost'))) {
      return this.attachContextAndActions(
        queryText,
        "I can assist you with your lost parking token. Under our secure recovery protocol, I have verified an active session for your vehicle. You can initiate identity verification via OTP to generate a temporary recovery credential.",
        "Rule-Based Expert Engine"
      );
    }

    if (lower.includes('where') || lower.includes('slot') || lower.includes('bike') || lower.includes('car') || lower.includes('parked')) {
      return this.attachContextAndActions(
        queryText,
        `Your vehicle (${activeParkingSession.vehicleModel}, ${activeParkingSession.vehicleNumber}) is currently parked in **${activeParkingSession.parkingSlot}** (${activeParkingSession.zone}). It entered at ${activeParkingSession.formattedEntryTime}.`,
        "Rule-Based Expert Engine"
      );
    }

    if (lower.includes('fee') || lower.includes('cost') || lower.includes('charge') || lower.includes('pay') || lower.includes('amount')) {
      return this.attachContextAndActions(
        queryText,
        `Your current parking duration is approximately 2 hours 25 minutes. At the standard rate of ₹${activeParkingSession.hourlyRate}/hr, your current parking fee is **₹${activeParkingSession.currentFee}**.`,
        "Rule-Based Expert Engine"
      );
    }

    if (lower.includes('friend') || lower.includes('delegate') || lower.includes('brother') || lower.includes('someone else') || lower.includes('collect')) {
      return this.attachContextAndActions(
        queryText,
        "You can securely authorize a friend or relative to retrieve your vehicle using Delegated Vehicle Retrieval. You set a specific time window, and the system issues a temporary cryptographic QR token and OTP for gate verification.",
        "Rule-Based Expert Engine"
      );
    }

    return this.attachContextAndActions(
      queryText,
      "I am your GenAI Smart Parking Assistant. You can ask me any doubt about parking slot locations, fee rates, lost token recovery procedures, or how to authorize a proxy to collect your vehicle.",
      "Rule-Based Expert Engine"
    );
  }
}

export const aiService = new AIService();
