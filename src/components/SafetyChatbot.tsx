import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Languages, AlertTriangle, Heart, Wind, ThermometerSun, Droplets, MapPin, Shield } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface SafetyTip {
  keyword: string[];
  responseEn: string;
  responseHi: string;
}

const safetyTips: SafetyTip[] = [
  {
    keyword: ['hello', 'hi', 'hey', 'start', 'namaste'],
    responseEn: 'Hello! I am your mining safety assistant. I can provide emergency tips and safety guidance. Ask me about:\n• High heart rate\n• Air toxicity\n• Temperature issues\n• Emergency procedures\n• Safety equipment\n\nHow can I help you today?',
    responseHi: 'नमस्ते! मैं आपका खनन सुरक्षा सहायक हूं। मैं आपातकालीन सुझाव और सुरक्षा मार्गदर्शन प्रदान कर सकता हूं। मुझसे पूछें:\n• उच्च हृदय गति\n• वायु विषाक्तता\n• तापमान समस्याएं\n• आपातकालीन प्रक्रियाएं\n• सुरक्षा उपकरण\n\nआज मैं आपकी कैसे मदद कर सकता हूं?'
  },
  {
    keyword: ['heart rate', 'heartbeat', 'pulse', 'heart', 'bpm', 'हृदय', 'दिल', 'धड़कन'],
    responseEn: '🫀 HIGH HEART RATE EMERGENCY:\n\n1. STOP all physical activity immediately\n2. Sit down and rest in a safe location\n3. Take slow, deep breaths (inhale 4 sec, hold 4 sec, exhale 4 sec)\n4. Alert your supervisor via radio\n5. If above 120 BPM for >2 minutes, evacuate to surface\n6. Drink water if available\n7. Loosen any tight clothing\n\n⚠️ SEEK MEDICAL HELP if:\n• Heart rate stays above 120 BPM\n• Chest pain or pressure\n• Difficulty breathing\n• Dizziness or fainting',
    responseHi: '🫀 उच्च हृदय गति आपातकाल:\n\n1. तुरंत सभी शारीरिक गतिविधि बंद करें\n2. सुरक्षित स्थान पर बैठें और आराम करें\n3. धीमी, गहरी सांसें लें (4 सेकंड सांस लें, 4 सेकंड रोकें, 4 सेकंड छोड़ें)\n4. रेडियो के माध्यम से अपने पर्यवेक्षक को सूचित करें\n5. यदि 2 मिनट से अधिक समय तक 120 BPM से ऊपर है, तो सतह पर निकलें\n6. यदि उपलब्ध हो तो पानी पिएं\n7. कोई भी तंग कपड़े ढीला करें\n\n⚠️ चिकित्सा सहायता लें यदि:\n• हृदय गति 120 BPM से ऊपर रहती है\n• छाती में दर्द या दबाव\n• सांस लेने में कठिनाई\n• चक्कर आना या बेहोशी'
  },
  {
    keyword: ['air', 'toxicity', 'gas', 'breathing', 'toxic', 'poisonous', 'oxygen', 'वायु', 'गैस', 'सांस', 'विषाक्त', 'जहरीला'],
    responseEn: '☣️ HIGH AIR TOXICITY EMERGENCY:\n\n1. PUT ON your oxygen mask/respirator IMMEDIATELY\n2. ALERT everyone nearby - shout "GAS ALERT!"\n3. Move to fresh air zone or evacuation route\n4. Do NOT run - move quickly but steadily\n5. Help others who may be affected\n6. Report to control room via emergency radio\n7. Do NOT remove mask until in safe zone\n\n⚠️ SYMPTOMS OF GAS POISONING:\n• Dizziness or headache\n• Nausea or vomiting\n• Confusion or disorientation\n• Rapid breathing\n• Chest tightness\n\n🚨 EVACUATION REQUIRED if toxicity >20 PPM',
    responseHi: '☣️ उच्च वायु विषाक्तता आपातकाल:\n\n1. तुरंत अपना ऑक्सीजन मास्क/रेस्पिरेटर पहनें\n2. आस-पास के सभी लोगों को सचेत करें - "गैस अलर्ट!" चिल्लाएं\n3. ताजी हवा क्षेत्र या निकासी मार्ग की ओर बढ़ें\n4. न भागें - तेजी से लेकिन स्थिर रूप से चलें\n5. प्रभावित अन्य लोगों की मदद करें\n6. आपातकालीन रेडियो के माध्यम से नियंत्रण कक्ष को रिपोर्ट करें\n7. सुरक्षित क्षेत्र में आने तक मास्क न हटाएं\n\n⚠️ गैस विषाक्तता के लक्षण:\n• चक्कर आना या सिरदर्द\n• मतली या उल्टी\n• भ्रम या दिशाहीनता\n• तेज सांस लेना\n• छाती में जकड़न\n\n🚨 20 PPM से अधिक विषाक्तता पर निकासी आवश्यक'
  },
  {
    keyword: ['temperature', 'heat', 'hot', 'cold', 'fever', 'तापमान', 'गर्मी', 'ठंड', 'बुखार'],
    responseEn: '🌡️ TEMPERATURE EMERGENCY:\n\nFOR HIGH TEMPERATURE (>35°C):\n1. Move to cooler area immediately\n2. Remove excess clothing/equipment if safe\n3. Drink water slowly (not too fast)\n4. Wet cloth on forehead, neck, wrists\n5. Rest in shade or ventilated area\n6. Monitor for heat exhaustion signs\n\nFOR LOW TEMPERATURE (<15°C):\n1. Move to warmer area\n2. Add layers of clothing\n3. Drink warm (not hot) liquids\n4. Keep moving to generate warmth\n5. Cover head and extremities\n\n⚠️ WARNING SIGNS:\n• Excessive sweating or no sweating\n• Confusion or slurred speech\n• Rapid pulse\n• Severe shivering\n• Loss of coordination',
    responseHi: '🌡️ तापमान आपातकाल:\n\nउच्च तापमान के लिए (>35°C):\n1. तुरंत ठंडे क्षेत्र में जाएं\n2. यदि सुरक्षित हो तो अतिरिक्त कपड़े/उपकरण हटाएं\n3. धीरे-धीरे पानी पिएं (बहुत तेज नहीं)\n4. माथे, गर्दन, कलाई पर गीला कपड़ा रखें\n5. छाया या हवादार क्षेत्र में आराम करें\n6. गर्मी की थकावट के लक्षणों की निगरानी करें\n\nकम तापमान के लिए (<15°C):\n1. गर्म क्षेत्र में जाएं\n2. कपड़ों की परतें जोड़ें\n3. गर्म (गरम नहीं) तरल पदार्थ पिएं\n4. गर्मी पैदा करने के लिए चलते रहें\n5. सिर और अंगों को ढकें\n\n⚠️ चेतावनी संकेत:\n• अत्यधिक पसीना या बिल्कुल पसीना नहीं\n• भ्रम या अस्पष्ट भाषण\n• तेज नाड़ी\n• गंभीर कंपकंपी\n• समन्वय की हानि'
  },
  {
    keyword: ['emergency', 'help', 'danger', 'accident', 'injured', 'hurt', 'आपातकाल', 'मदद', 'खतरा', 'दुर्घटना', 'घायल'],
    responseEn: '🚨 GENERAL EMERGENCY PROCEDURE:\n\n1. STAY CALM - panic causes mistakes\n2. ASSESS the situation:\n   • Are you in immediate danger?\n   • Can you move safely?\n   • Are others affected?\n\n3. ACTIVATE emergency alert:\n   • Press emergency button\n   • Radio: "EMERGENCY at [location]"\n   • Sound alarm if available\n\n4. EVACUATE if necessary:\n   • Use marked emergency routes\n   • Help injured if safe to do so\n   • Don\'t use elevators\n   • Stay low if smoke present\n\n5. MUSTER at designated assembly point\n\n6. WAIT for emergency responders\n\n📞 Emergency Contact: Control Room\n🗺️ Know your nearest emergency exit!',
    responseHi: '🚨 सामान्य आपातकालीन प्रक्रिया:\n\n1. शांत रहें - घबराहट से गलतियां होती हैं\n2. स्थिति का मूल्यांकन करें:\n   • क्या आप तत्काल खतरे में हैं?\n   • क्या आप सुरक्षित रूप से आगे बढ़ सकते हैं?\n   • क्या अन्य प्रभावित हैं?\n\n3. आपातकालीन अलर्ट सक्रिय करें:\n   • आपातकालीन बटन दबाएं\n   • रेडियो: "[स्थान] पर आपातकाल"\n   • यदि उपलब्ध हो तो अलार्म बजाएं\n\n4. यदि आवश्यक हो तो निकलें:\n   • चिह्नित आपातकालीन मार्गों का उपयोग करें\n   • यदि सुरक्षित हो तो घायलों की मदद करें\n   • लिफ्ट का उपयोग न करें\n   • धुआं होने पर नीचे रहें\n\n5. निर्धारित सभा बिंदु पर जमा हों\n\n6. आपातकालीन उत्तरदाताओं की प्रतीक्षा करें\n\n📞 आपातकालीन संपर्क: नियंत्रण कक्ष\n🗺️ अपने निकटतम आपातकालीन निकास को जानें!'
  },
  {
    keyword: ['equipment', 'gear', 'safety', 'protective', 'mask', 'helmet', 'उपकरण', 'सुरक्षा', 'मास्क', 'हेलमेट'],
    responseEn: '🛡️ ESSENTIAL SAFETY EQUIPMENT:\n\n✓ MUST WEAR AT ALL TIMES:\n1. Hard hat/helmet - protects head\n2. Safety boots - steel toe protection\n3. High-visibility vest - be seen\n4. Headlamp - hands-free lighting\n5. Personal alarm - emergency alert\n\n✓ BREATHING PROTECTION:\n• N95 mask for dust\n• Full respirator for gas zones\n• Self-contained breathing apparatus (SCBA) for emergencies\n\n✓ PERSONAL MONITORING:\n• Gas detector badge\n• Heart rate monitor\n• GPS tracker\n\n✓ COMMUNICATION:\n• Two-way radio\n• Whistle\n• Emergency beacon\n\n📋 DAILY CHECK:\nInspect all equipment before shift. Report damaged equipment immediately!',
    responseHi: '🛡️ आवश्यक सुरक्षा उपकरण:\n\n✓ हर समय पहनना अनिवार्य:\n1. हार्ड हैट/हेलमेट - सिर की सुरक्षा\n2. सुरक्षा जूते - स्टील टो सुरक्षा\n3. उच्च दृश्यता बनियान - दिखाई दें\n4. हेडलैंप - हाथ-मुक्त प्रकाश\n5. व्यक्तिगत अलार्म - आपातकालीन चेतावनी\n\n✓ सांस की सुरक्षा:\n• धूल के लिए N95 मास्क\n• गैस क्षेत्रों के लिए पूर्ण श्वासयंत्र\n• आपात स्थिति के लिए स्व-निहित श्वास तंत्र (SCBA)\n\n✓ व्यक्तिगत निगरानी:\n• गैस डिटेक्टर बैज\n• हृदय गति मॉनिटर\n• GPS ट्रैकर\n\n✓ संचार:\n• दो-तरफा रेडियो\n• सीटी\n• आपातकालीन बीकन\n\n📋 दैनिक जांच:\nशिफ्ट से पहले सभी उपकरणों का निरीक्षण करें। क्षतिग्रस्त उपकरण की तुरंत रिपोर्ट करें!'
  },
  {
    keyword: ['collapse', 'roof fall', 'cave in', 'trapped', 'stuck', 'गिरना', 'फंसना', 'धंसना'],
    responseEn: '⚠️ ROOF COLLAPSE / CAVE-IN EMERGENCY:\n\nIF YOU ARE TRAPPED:\n1. Stay calm - conserve oxygen\n2. Check for injuries\n3. Make noise periodically (knock on pipes/rocks)\n4. Use whistle if you have one\n5. Activate emergency beacon\n6. If possible, move to safer location\n7. Cover mouth/nose to filter dust\n8. Conserve phone/radio battery\n\nIF OTHERS ARE TRAPPED:\n1. DO NOT enter unstable area alone\n2. Alert rescue team immediately\n3. Mark location clearly\n4. Provide information about trapped miners\n5. Keep communication line open\n6. Wait for professional rescue team\n\n🆘 Stay visible, stay vocal, stay alive!\nRescue teams WILL find you!',
    responseHi: '⚠️ छत गिरने / धंसने की आपात स्थिति:\n\nयदि आप फंस गए हैं:\n1. शांत रहें - ऑक्सीजन बचाएं\n2. चोटों की जांच करें\n3. समय-समय पर शोर करें (पाइप/पत्थर पर दस्तक दें)\n4. यदि आपके पास सीटी है तो उसका उपयोग करें\n5. आपातकालीन बीकन सक्रिय करें\n6. यदि संभव हो तो सुरक्षित स्थान पर जाएं\n7. धूल को फ़िल्टर करने के लिए मुंह/नाक को ढकें\n8. फोन/रेडियो बैटरी बचाएं\n\nयदि अन्य फंसे हैं:\n1. अकेले अस्थिर क्षेत्र में प्रवेश न करें\n2. तुरंत बचाव दल को सतर्क करें\n3. स्थान को स्पष्ट रूप से चिह्नित करें\n4. फंसे खनिकों के बारे में जानकारी प्रदान करें\n5. संचार लाइन खुली रखें\n6. पेशेवर बचाव दल की प्रतीक्षा करें\n\n🆘 दिखाई दें, आवाज दें, जीवित रहें!\nबचाव दल आपको ढूंढ लेंगे!'
  },
  {
    keyword: ['fire', 'smoke', 'burning', 'flames', 'आग', 'धुआं', 'जलना'],
    responseEn: '🔥 FIRE EMERGENCY:\n\n1. SOUND THE ALARM immediately\n2. EVACUATE - don\'t fight large fires\n3. Stay LOW - smoke rises, clean air is below\n4. Touch doors before opening (hot = fire behind)\n5. Close doors behind you (contain fire)\n6. Use EMERGENCY EXITS only\n7. DO NOT use elevators\n8. Proceed to assembly point\n\nIF SMALL FIRE:\n• Use fire extinguisher (PASS method):\n  P - Pull pin\n  A - Aim at base of fire\n  S - Squeeze handle\n  S - Sweep side to side\n\nIF CLOTHES ON FIRE:\n• STOP - don\'t run\n• DROP - to ground\n• ROLL - back and forth to smother flames\n\n☁️ If trapped by smoke:\n• Seal door gaps with cloth\n• Signal from window/opening\n• Stay low to ground',
    responseHi: '🔥 अग्नि आपातकाल:\n\n1. तुरंत अलार्म बजाएं\n2. निकलें - बड़ी आग से न लड़ें\n3. नीचे रहें - धुआं ऊपर उठता है, स्वच्छ हवा नीचे है\n4. खोलने से पहले दरवाजे छुएं (गर्म = पीछे आग)\n5. अपने पीछे दरवाजे बंद करें (आग को रोकें)\n6. केवल आपातकालीन निकास का उपयोग करें\n7. लिफ्ट का उपयोग न करें\n8. सभा बिंदु की ओर बढ़ें\n\nयदि छोटी आग:\n• अग्निशामक का उपयोग करें (PASS विधि):\n  P - पिन खींचें\n  A - आग के आधार पर लक्ष्य रखें\n  S - हैंडल निचोड़ें\n  S - एक तरफ से दूसरी तरफ घुमाएं\n\nयदि कपड़ों में आग:\n• रुकें - न भागें\n• गिरें - जमीन पर\n• लुढ़कें - आगे पीछे लपटों को बुझाने के लिए\n\n☁️ यदि धुएं से फंस गए:\n• कपड़े से दरवाजे के अंतराल बंद करें\n• खिड़की/खुलने से संकेत दें\n• जमीन के पास रहें'
  },
  {
    keyword: ['water', 'flood', 'wet', 'drowning', 'पानी', 'बाढ़', 'डूबना'],
    responseEn: '💧 WATER/FLOODING EMERGENCY:\n\n1. EVACUATE to higher ground immediately\n2. DO NOT walk through moving water\n3. Turn off electrical equipment if safe\n4. Alert others via radio/alarm\n5. Use designated flood escape routes\n6. Avoid flooded shafts and tunnels\n\nIF WATER IS RISING:\n• Move upward quickly but carefully\n• Don\'t try to save equipment\n• Help others who need assistance\n• Account for all team members\n\nWATER SAFETY:\n• Never enter unknown water depths\n• Flowing water is dangerous (even shallow)\n• Watch for electrical hazards\n• Be aware of slip hazards\n\n🚨 Even 6 inches of moving water can knock you down!\n\n⚡ ELECTROCUTION RISK in flooded areas with power!',
    responseHi: '💧 पानी/बाढ़ आपातकाल:\n\n1. तुरंत ऊंची जगह पर निकलें\n2. बहते पानी में न चलें\n3. यदि सुरक्षित हो तो विद्युत उपकरण बंद करें\n4. रेडियो/अलार्म के माध्यम से दूसरों को सतर्क करें\n5. निर्धारित बाढ़ निकासी मार्गों का उपयोग करें\n6. बाढ़ग्रस्त शाफ्ट और सुरंगों से बचें\n\nयदि पानी बढ़ रहा है:\n• तेजी से लेकिन सावधानी से ऊपर जाएं\n• उपकरण बचाने की कोशिश न करें\n• सहायता की आवश्यकता वाले अन्य लोगों की मदद करें\n• सभी टीम सदस्यों का हिसाब रखें\n\nपानी सुरक्षा:\n• अज्ञात पानी की गहराई में कभी न जाएं\n• बहता पानी खतरनाक है (यहां तक कि उथला भी)\n• विद्युत खतरों से सावधान रहें\n• फिसलन खतरों से अवगत रहें\n\n🚨 6 इंच बहता पानी भी आपको गिरा सकता है!\n\n⚡ बिजली वाले बाढ़ग्रस्त क्षेत्रों में बिजली का झटका जोखिम!'
  },
  {
    keyword: ['first aid', 'injury', 'bleeding', 'wound', 'cut', 'प्राथमिक चिकित्सा', 'चोट', 'खून बहना', 'घाव'],
    responseEn: '🏥 BASIC FIRST AID:\n\nFOR BLEEDING:\n1. Apply direct pressure with clean cloth\n2. Elevate wounded area above heart\n3. Maintain pressure for 10-15 minutes\n4. Apply bandage firmly but not too tight\n5. Seek medical help if severe\n\nFOR BURNS:\n1. Remove from heat source\n2. Cool with water (not ice) for 10 minutes\n3. Cover with clean, dry dressing\n4. Do NOT apply ointments/butter\n5. Seek medical attention\n\nFOR FRACTURES:\n1. Don\'t move injured person unnecessarily\n2. Immobilize the injured area\n3. Apply ice pack if available\n4. Call for medical assistance\n\nFOR UNCONSCIOUSNESS:\n1. Check breathing and pulse\n2. Place in recovery position if breathing\n3. Start CPR if not breathing\n4. Call emergency services\n\n⚕️ Remember: Your safety first!\nDon\'t become a victim while helping!',
    responseHi: '🏥 बुनियादी प्राथमिक चिकित्सा:\n\nखून बहने के लिए:\n1. साफ कपड़े से सीधा दबाव लगाएं\n2. घायल क्षेत्र को हृदय से ऊपर उठाएं\n3. 10-15 मिनट तक दबाव बनाए रखें\n4. पट्टी मजबूती से लगाएं लेकिन बहुत कसकर नहीं\n5. यदि गंभीर हो तो चिकित्सा सहायता लें\n\nजलने के लिए:\n1. गर्मी स्रोत से हटाएं\n2. 10 मिनट के लिए पानी (बर्फ नहीं) से ठंडा करें\n3. साफ, सूखी ड्रेसिंग से ढकें\n4. मलहम/मक्खन न लगाएं\n5. चिकित्सा ध्यान लें\n\nफ्रैक्चर के लिए:\n1. घायल व्यक्ति को अनावश्यक रूप से न हिलाएं\n2. घायल क्षेत्र को स्थिर करें\n3. यदि उपलब्ध हो तो आइस पैक लगाएं\n4. चिकित्सा सहायता के लिए कॉल करें\n\nबेहोशी के लिए:\n1. सांस और नाड़ी की जांच करें\n2. यदि सांस ले रहा है तो रिकवरी स्थिति में रखें\n3. यदि सांस नहीं ले रहा है तो CPR शुरू करें\n4. आपातकालीन सेवाओं को कॉल करें\n\n⚕️ याद रखें: पहले आपकी सुरक्षा!\nमदद करते समय पीड़ित न बनें!'
  }
];

export default function SafetyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: language === 'en'
          ? 'Hello! I am your mining safety assistant. I can provide emergency tips and safety guidance. Type "hello" to see what I can help with!'
          : 'नमस्ते! मैं आपका खनन सुरक्षा सहायक हूं। मैं आपातकालीन सुझाव और सुरक्षा मार्गदर्शन प्रदान कर सकता हूं। "hello" टाइप करें देखने के लिए मैं किसमें मदद कर सकता हूं!',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, language]);

  const findResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    for (const tip of safetyTips) {
      for (const keyword of tip.keyword) {
        if (lowerInput.includes(keyword.toLowerCase())) {
          return language === 'en' ? tip.responseEn : tip.responseHi;
        }
      }
    }

    return language === 'en'
      ? 'I can help with:\n• Heart rate emergencies\n• Air toxicity issues\n• Temperature problems\n• General emergencies\n• Safety equipment\n• First aid\n• Fire safety\n• Water/flooding\n• Cave-ins\n\nPlease ask about any of these topics!'
      : 'मैं इसमें मदद कर सकता हूं:\n• हृदय गति आपात स्थिति\n• वायु विषाक्तता समस्याएं\n• तापमान समस्याएं\n• सामान्य आपात स्थिति\n• सुरक्षा उपकरण\n• प्राथमिक चिकित्सा\n• अग्नि सुरक्षा\n• पानी/बाढ़\n• धंसना\n\nकृपया इन विषयों में से किसी के बारे में पूछें!';
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse = findResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);

    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
    const langMessage: Message = {
      id: Date.now().toString(),
      text: language === 'en'
        ? 'भाषा हिंदी में बदल गई। मैं अब हिंदी में जवाब दूंगा!'
        : 'Language changed to English. I will now respond in English!',
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, langMessage]);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all hover:scale-110 z-50 group"
          aria-label="Open safety chatbot"
        >
          <MessageSquare className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {language === 'en' ? 'Safety Assistant' : 'सुरक्षा सहायक'}
          </div>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-amber-500">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-lg">
                  {language === 'en' ? 'Safety Assistant' : 'सुरक्षा सहायक'}
                </h3>
                <p className="text-xs opacity-90">
                  {language === 'en' ? 'Emergency tips & guidance' : 'आपातकालीन सुझाव और मार्गदर्शन'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title={language === 'en' ? 'Switch to Hindi' : 'अंग्रेजी में बदलें'}
              >
                <Languages className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-800 shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                  <span className={`text-xs mt-1 block ${
                    message.sender === 'user' ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t-2 border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'en' ? 'Ask about safety...' : 'सुरक्षा के बारे में पूछें...'}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {language === 'en'
                ? '24/7 Emergency assistance available'
                : '24/7 आपातकालीन सहायता उपलब्ध'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
