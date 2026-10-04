// ===================== NEXUS SLOT · 19 语言翻译 =====================
(function(){
  const TRANSLATIONS = {
    en: { howto_title: 'How to Play · Game Description', howto_p1: '<span class="highlight-cyan">Spin the 5 reels</span> to match crypto symbols. You get <em>3 free spins</em> to start — no deposit needed!', howto_p2: 'Match <em>2+ identical symbols</em> on the center payline to win. Win up to <em>10,000 USDT</em> for 5-of-a-kind!', howto_p3: 'After your spins, claim winnings to your balance, then <span class="highlight-cyan">extract rewards</span> via USDT TRC20.', banner_kicker: 'WIN UP TO', banner_amt: '10,000 USDT', banner_end: 'FOR FREE!', banner_sub: 'Spin 3 times to unlock your starting balance. <em>No deposit required to play!</em>', spin_btn: 'SPIN NOW', spins_left: 'FREE SPINS REMAINING:', rolling_title: '⛓ RECENT WITHDRAWALS',
      spinning_btn: 'SPINNING...', extract_btn: 'EXTRACT REWARDS', claim_btn: 'CLAIM TO BALANCE', claimed: 'CLAIMED',
      win_kicker_normal: 'NEON PAYOUT', win_kicker_jackpot: 'QUANTUM JACKPOT', win_title_normal: 'YOU WIN', win_title_jackpot: 'JACKPOT', win_desc: 'Matched {n} {sym} symbols! +{amt} {cur}',
      no_win_kicker: 'NO LUCK THIS TIME', no_win_title: 'NO WIN', no_win_desc: 'All 5 symbols are different. Please try again!', continue_btn: 'CONTINUE',
      extract_kicker: 'WITHDRAW', extract_title: 'EXTRACT', extract_label: 'ENTER YOUR WALLET ADDRESS:', extract_label_usdt: 'ENTER YOUR USDT TRC20 ADDRESS:', extract_label_btc: 'ENTER YOUR BTC ADDRESS:', extract_label_eth: 'ENTER YOUR ETH ADDRESS:', extract_label_doge: 'ENTER YOUR DOGE ADDRESS:', extract_label_trx: 'ENTER YOUR TRX ADDRESS:', extract_label_sol: 'ENTER YOUR SOL ADDRESS:', submit_withdraw: 'SUBMIT WITHDRAWAL',
      invalid_addr: 'Invalid wallet address. Please check and try again.',
      invalid_addr_usdt: 'USDT address must start with T and be a valid 34-char TRC20 address.',
      invalid_addr_btc: 'BTC address must start with 1, 3 or bc1, and be 26-62 characters long.',
      invalid_addr_eth: 'ETH address must start with 0x and be 42 characters long.',
      invalid_addr_doge: 'DOGE address must start with D and be 34 characters long.',
      invalid_addr_trx: 'TRX address must start with T and be 34 characters long.',
      invalid_addr_sol: 'SOL address must be Base58 encoded, 32-44 characters long.',
      confirm_kicker: 'NOTIFICATION', confirm_title: 'WITHDRAWAL REQUEST SUBMITTED', confirm_p1: 'Your reward withdrawal request has been submitted successfully!', confirm_p2: 'We will transfer this reward to your wallet within {n} business day. Please stay tuned and check your account.',
      view_records: '📋 My Withdrawals', contact_support: 'Contact Support', contact_to_get_reward: '💰 Contact support to get your reward',
      my_records_title: 'My Withdrawal Records', my_records_kicker: 'WITHDRAWAL RECORDS', close_btn: 'Close', loading: 'Loading...', no_records: 'No withdrawal records', load_failed: 'Load failed', status_pending: '⏳ Pending', status_approved: '✅ Approved', status_rejected: '❌ Rejected', label_addr: 'Address', label_amount: 'Amount', label_time: 'Time',
      limit_reached: 'Daily withdrawal limit reached. Please come back tomorrow.',
      safari_alert_body: 'For the game to work properly, please tap "OK" to copy the link, then open your iPhone Safari browser and paste it to visit.', safari_alert_copied: 'Link copied! Please open Safari and paste it to visit.', copy_fail_prompt: 'Copy failed, please manually copy this link:'
    },
    zh: { howto_title: '玩法说明 · 游戏描述', howto_p1: '<span class="highlight-cyan">转动5个转轮</span>匹配加密货币符号。开局即送<em>3次免费旋转</em>，无需存款！', howto_p2: '在中央赔付线上匹配<em>2个以上相同符号</em>即可赢奖，五个相同最高赢取<em>10,000 USDT</em>！', howto_p3: '旋转结束后，领取奖金到余额，然后通过对应币种<span class="highlight-cyan">提取奖励</span>。', banner_kicker: '赢取高达', banner_amt: '10,000 USDT', banner_end: '免费！', banner_sub: '旋转3次解锁起始余额。<em>无需存款即可游玩！</em>', spin_btn: '立即旋转', spins_left: '剩余免费旋转：', rolling_title: '⛓ 近期提现',
      spinning_btn: '旋转中...', extract_btn: '提取奖励', claim_btn: '领取到余额', claimed: '已领取',
      win_kicker_normal: '霓虹奖励', win_kicker_jackpot: '量子头奖', win_title_normal: '你赢了', win_title_jackpot: '头奖', win_desc: '匹配了 {n} 个 {sym} 符号！+{amt} {cur}',
      no_win_kicker: '这次没中', no_win_title: '很遗憾，未中奖', no_win_desc: '5 个符号都不相同，请再试一次！', continue_btn: '继续',
      extract_kicker: '提现', extract_title: '提取', extract_label: '输入你的钱包地址：', extract_label_usdt: '输入你的 USDT TRC20 地址：', extract_label_btc: '输入你的 BTC 地址：', extract_label_eth: '输入你的 ETH 地址：', extract_label_doge: '输入你的 DOGE 地址：', extract_label_trx: '输入你的 TRX 地址：', extract_label_sol: '输入你的 SOL 地址：', submit_withdraw: '提交提现',
      invalid_addr: '钱包地址无效，请检查后重试。',
      invalid_addr_usdt: 'USDT 地址必须以 T 开头且为 34 位有效的 TRC20 地址。',
      invalid_addr_btc: 'BTC 地址必须以 1、3 或 bc1 开头，长度 26-62 位。',
      invalid_addr_eth: 'ETH 地址必须以 0x 开头且为 42 位。',
      invalid_addr_doge: 'DOGE 地址必须以 D 开头且为 34 位。',
      invalid_addr_trx: 'TRX 地址必须以 T 开头且为 34 位。',
      invalid_addr_sol: 'SOL 地址必须为 Base58 编码，长度 32-44 位。',
      confirm_kicker: '通知', confirm_title: '提现请求已提交', confirm_p1: '您的奖励提现请求已成功提交！', confirm_p2: '我们将在 {n} 个工作日内将奖励转入您的钱包。请保持关注并查看您的账户。',
      view_records: '📋 我的提现记录', contact_support: '联系客服', contact_to_get_reward: '💰 联系客服，获取奖励',
      my_records_title: '我的提现记录', my_records_kicker: '提现记录', close_btn: '关闭', loading: '加载中...', no_records: '暂无提现记录', load_failed: '加载失败', status_pending: '⏳ 等待审核', status_approved: '✅ 已通过', status_rejected: '❌ 已拒绝', label_addr: '地址', label_amount: '金额', label_time: '时间',
      limit_reached: '今日提现次数已用完，请明天再来。',
      safari_alert_body: '为保证游戏正常运行，请点击"确定"复制链接，然后打开您手机自带的 Safari 浏览器，粘贴并访问。', safari_alert_copied: '链接已复制！请打开 Safari 浏览器，粘贴并访问。', copy_fail_prompt: '复制失败，请手动复制以下链接：'
    },
    es: { howto_title: 'Cómo Jugar · Descripción', howto_p1: '<span class="highlight-cyan">Gira los 5 carretes</span> para igualar símbolos cripto. ¡Tienes <em>3 giros gratis</em> para empezar, sin depósito!', howto_p2: 'Iguala <em>2+ símbolos idénticos</em> en la línea de pago central para ganar. ¡Gana hasta <em>10,000</em> por 5 iguales!', howto_p3: 'Después de tus giros, reclama las ganancias a tu saldo y luego <span class="highlight-cyan">extrae recompensas</span>.', banner_kicker: 'GANA HASTA', banner_amt: '10,000 USDT', banner_end: '¡GRATIS!', banner_sub: 'Gira 3 veces para desbloquear tu saldo inicial. <em>¡No se requiere depósito!</em>', spin_btn: 'GIRAR AHORA', spins_left: 'GIROS GRATIS RESTANTES:', rolling_title: '⛓ RETIROS RECIENTES',
      spinning_btn: 'GIRANDO...', extract_btn: 'EXTRAER RECOMPENSAS', claim_btn: 'RECLAMAR AL SALDO', claimed: 'RECLAMADO',
      win_kicker_normal: 'PAGO NEÓN', win_kicker_jackpot: 'JACKPOT CUÁNTICO', win_title_normal: 'GANASTE', win_title_jackpot: 'JACKPOT', win_desc: '¡Combinaste {n} símbolos {sym}! +{amt} {cur}',
      no_win_kicker: 'SIN SUERTE ESTA VEZ', no_win_title: 'SIN PREMIO', no_win_desc: 'Los 5 símbolos son diferentes. ¡Inténtalo de nuevo!', continue_btn: 'CONTINUAR',
      extract_kicker: 'RETIRO', extract_title: 'EXTRAER', extract_label: 'INGRESA TU DIRECCIÓN DE CARTERA:', extract_label_usdt: 'INGRESA TU DIRECCIÓN USDT TRC20:', extract_label_btc: 'INGRESA TU DIRECCIÓN BTC:', extract_label_eth: 'INGRESA TU DIRECCIÓN ETH:', extract_label_doge: 'INGRESA TU DIRECCIÓN DOGE:', extract_label_trx: 'INGRESA TU DIRECCIÓN TRX:', extract_label_sol: 'INGRESA TU DIRECCIÓN SOL:', submit_withdraw: 'ENVIAR RETIRO',
      invalid_addr: 'Dirección de cartera inválida. Verifica e inténtalo de nuevo.',
      invalid_addr_usdt: 'La dirección USDT debe empezar con T y ser una dirección TRC20 válida de 34 caracteres.',
      invalid_addr_btc: 'La dirección BTC debe empezar con 1, 3 o bc1 y tener 26-62 caracteres.',
      invalid_addr_eth: 'La dirección ETH debe empezar con 0x y tener 42 caracteres.',
      invalid_addr_doge: 'La dirección DOGE debe empezar con D y tener 34 caracteres.',
      invalid_addr_trx: 'La dirección TRX debe empezar con T y tener 34 caracteres.',
      invalid_addr_sol: 'La dirección SOL debe estar en Base58, 32-44 caracteres.',
      confirm_kicker: 'NOTIFICACIÓN', confirm_title: 'SOLICITUD DE RETIRO ENVIADA', confirm_p1: '¡Tu solicitud de retiro ha sido enviada con éxito!', confirm_p2: 'Transferiremos esta recompensa a tu billetera dentro de {n} día hábil. Mantente atento y revisa tu cuenta.',
      view_records: '📋 Mis Retiros', contact_support: 'Contactar Soporte', contact_to_get_reward: '💰 Contacta al soporte para obtener tu recompensa',
      my_records_title: 'Mis Registros de Retiro', my_records_kicker: 'REGISTROS DE RETIRO', close_btn: 'Cerrar', loading: 'Cargando...', no_records: 'Sin registros', load_failed: 'Error al cargar', status_pending: '⏳ Pendiente', status_approved: '✅ Aprobado', status_rejected: '❌ Rechazado', label_addr: 'Dirección', label_amount: 'Cantidad', label_time: 'Hora',
      limit_reached: 'Se alcanzó el límite diario de retiros. Vuelve mañana.',
      safari_alert_body: 'Para que el juego funcione correctamente, toque "Aceptar" para copiar el enlace, luego abra Safari y péguelo para visitar.', safari_alert_copied: '¡Enlace copiado! Abra Safari y péguelo para visitar.', copy_fail_prompt: 'Error al copiar, copie manualmente este enlace:'
    },
    hi: { howto_title: 'कैसे खेलें · गेम विवरण', howto_p1: '<span class="highlight-cyan">5 रील घुमाएं</span> और क्रिप्टो प्रतीकों को मिलाएं। शुरू करने के लिए <em>3 मुफ्त स्पिन</em> मिलते हैं — कोई जमा नहीं!', howto_p2: 'केंद्र पेलाइन पर <em>2+ समान प्रतीक</em> मिलाएं और जीतें। 5-ऑफ-ए-काइंड पर <em>10,000</em> तक जीतें!', howto_p3: 'स्पिन के बाद, जीत को बैलेंस में क्लेम करें, फिर <span class="highlight-cyan">रिवॉर्ड निकालें</span>।', banner_kicker: 'जीतें', banner_amt: '10,000 USDT', banner_end: 'मुफ्त!', banner_sub: 'अपना शुरुआती बैलेंस अनलॉक करने के लिए 3 बार स्पिन करें। <em>खेलने के लिए कोई जमा नहीं!</em>', spin_btn: 'अभी स्पिन करें', spins_left: 'शेष मुफ्त स्पिन:', rolling_title: '⛓ हाल के निकासी',
      spinning_btn: 'स्पिन हो रहा है...', extract_btn: 'रिवॉर्ड निकालें', claim_btn: 'बैलेंस में क्लेम करें', claimed: 'क्लेम हो गया',
      win_kicker_normal: 'नियॉन पेआउट', win_kicker_jackpot: 'क्वांटम जैकपॉट', win_title_normal: 'आप जीते', win_title_jackpot: 'जैकपॉट', win_desc: '{n} {sym} प्रतीक मिले! +{amt} {cur}',
      no_win_kicker: 'इस बार कोई किस्मत नहीं', no_win_title: 'कोई जीत नहीं', no_win_desc: 'सभी 5 प्रतीक अलग हैं। कृपया फिर से प्रयास करें!', continue_btn: 'जारी रखें',
      extract_kicker: 'निकासी', extract_title: 'निकालें', extract_label: 'अपना वॉलेट पता दर्ज करें:', extract_label_usdt: 'अपना USDT TRC20 पता दर्ज करें:', extract_label_btc: 'अपना BTC पता दर्ज करें:', extract_label_eth: 'अपना ETH पता दर्ज करें:', extract_label_doge: 'अपना DOGE पता दर्ज करें:', extract_label_trx: 'अपना TRX पता दर्ज करें:', extract_label_sol: 'अपना SOL पता दर्ज करें:', submit_withdraw: 'निकासी सबमिट करें',
      invalid_addr: 'अमान्य वॉलेट पता। कृपया जाँचें और पुनः प्रयास करें।',
      invalid_addr_usdt: 'USDT पता T से शुरू होना चाहिए और 34 वर्णों का मान्य TRC20 पता होना चाहिए।',
      invalid_addr_btc: 'BTC पता 1, 3 या bc1 से शुरू होना चाहिए और 26-62 वर्णों का होना चाहिए।',
      invalid_addr_eth: 'ETH पता 0x से शुरू होना चाहिए और 42 वर्णों का होना चाहिए।',
      invalid_addr_doge: 'DOGE पता D से शुरू होना चाहिए और 34 वर्णों का होना चाहिए।',
      invalid_addr_trx: 'TRX पता T से शुरू होना चाहिए और 34 वर्णों का होना चाहिए।',
      invalid_addr_sol: 'SOL पता Base58 में होना चाहिए, 32-44 वर्ण।',
      confirm_kicker: 'सूचना', confirm_title: 'निकासी अनुरोध सबमिट हो गया', confirm_p1: 'आपका इनाम निकासी अनुरोध सफलतापूर्वक सबमिट हो गया है!', confirm_p2: 'हम {n} कार्यदिवस के भीतर यह इनाम आपके वॉलेट में स्थानांतरित करेंगे। कृपया अपने खाते की जाँच करते रहें।',
      view_records: '📋 मेरी निकासी', contact_support: 'सहायता से संपर्क', contact_to_get_reward: '💰 अपना इनाम पाने के लिए सहायता से संपर्क करें',
      my_records_title: 'मेरे निकासी रिकॉर्ड', my_records_kicker: 'निकासी रिकॉर्ड', close_btn: 'बंद करें', loading: 'लोड हो रहा है...', no_records: 'कोई रिकॉर्ड नहीं', load_failed: 'लोड विफल', status_pending: '⏳ लंबित', status_approved: '✅ स्वीकृत', status_rejected: '❌ अस्वीकृत', label_addr: 'पता', label_amount: 'राशि', label_time: 'समय',
      limit_reached: 'दैनिक निकासी सीमा तक पहुंच गई। कृपया कल फिर आएं।',
      safari_alert_body: 'गेम ठीक से चलाने के लिए, कृपया "ठीक है" दबाकर लिंक कॉपी करें, फिर Safari ब्राउज़र खोलकर पेस्ट करें।', safari_alert_copied: 'लिंक कॉपी हो गया! कृपया Safari खोलकर पेस्ट करें।', copy_fail_prompt: 'कॉपी विफल, कृपया मैन्युअल रूप से कॉपी करें:'
    },
    ar: { howto_title: 'كيفية اللعب · وصف اللعبة', howto_p1: '<span class="highlight-cyan">قم بتدوير 5 بكرات</span> لمطابقة رموز العملات المشفرة. تحصل على <em>3 دورات مجانية</em> للبدء — بدون إيداع!', howto_p2: 'طابق <em>2+ رموز متطابقة</em> على خط الدفع المركزي للفوز. اربح حتى <em>10,000</em> لخمسة متطابقة!', howto_p3: 'بعد دوراتك، اطلب الأرباح إلى رصيدك، ثم <span class="highlight-cyan">استخرج المكافآت</span>.', banner_kicker: 'اربح حتى', banner_amt: '10,000 USDT', banner_end: 'مجانًا!', banner_sub: 'قم بالدوران 3 مرات لفتح رصيدك الأولي. <em>لا حاجة للإيداع للعب!</em>', spin_btn: 'قم بالدوران الآن', spins_left: 'الدورات المجانية المتبقية:', rolling_title: '⛓ عمليات السحب الأخيرة',
      spinning_btn: 'جارٍ الدوران...', extract_btn: 'استخراج المكافآت', claim_btn: 'استلام إلى الرصيد', claimed: 'تم الاستلام',
      win_kicker_normal: 'دفع نيون', win_kicker_jackpot: 'الجاكبوت الكمي', win_title_normal: 'لقد فزت', win_title_jackpot: 'جاكبوت', win_desc: 'طابقت {n} رموز {sym}! +{amt} {cur}',
      no_win_kicker: 'لا حظ هذه المرة', no_win_title: 'لا فوز', no_win_desc: 'جميع الرموز الخمسة مختلفة. يرجى المحاولة مرة أخرى!', continue_btn: 'متابعة',
      extract_kicker: 'سحب', extract_title: 'استخراج', extract_label: 'أدخل عنوان محفظتك:', extract_label_usdt: 'أدخل عنوان USDT TRC20:', extract_label_btc: 'أدخل عنوان BTC:', extract_label_eth: 'أدخل عنوان ETH:', extract_label_doge: 'أدخل عنوان DOGE:', extract_label_trx: 'أدخل عنوان TRX:', extract_label_sol: 'أدخل عنوان SOL:', submit_withdraw: 'إرسال السحب',
      invalid_addr: 'عنوان محفظة غير صالح. يرجى التحقق والمحاولة مرة أخرى.',
      invalid_addr_usdt: 'يجب أن يبدأ عنوان USDT بحرف T ويكون عنوان TRC20 صالحًا من 34 حرفًا.',
      invalid_addr_btc: 'يجب أن يبدأ عنوان BTC بـ 1 أو 3 أو bc1، ويكون 26-62 حرفًا.',
      invalid_addr_eth: 'يجب أن يبدأ عنوان ETH بـ 0x ويكون 42 حرفًا.',
      invalid_addr_doge: 'يجب أن يبدأ عنوان DOGE بحرف D ويكون 34 حرفًا.',
      invalid_addr_trx: 'يجب أن يبدأ عنوان TRX بحرف T ويكون 34 حرفًا.',
      invalid_addr_sol: 'يجب أن يكون عنوان SOL بترميز Base58، 32-44 حرفًا.',
      confirm_kicker: 'إشعار', confirm_title: 'تم إرسال طلب السحب', confirm_p1: 'تم إرسال طلب سحب المكافأة بنجاح!', confirm_p2: 'سنقوم بتحويل هذه المكافأة إلى محفظتك خلال {n} يوم عمل. يرجى البقاء على اطلاع والتحقق من حسابك.',
      view_records: '📋 سحوباتي', contact_support: 'اتصل بالدعم', contact_to_get_reward: '💰 اتصل بالدعم للحصول على مكافأتك',
      my_records_title: 'سجلات السحب', my_records_kicker: 'سجلات السحب', close_btn: 'إغلاق', loading: 'جارٍ التحميل...', no_records: 'لا توجد سجلات', load_failed: 'فشل التحميل', status_pending: '⏳ قيد المراجعة', status_approved: '✅ مقبول', status_rejected: '❌ مرفوض', label_addr: 'العنوان', label_amount: 'المبلغ', label_time: 'الوقت',
      limit_reached: 'تم الوصول إلى الحد اليومي للسحب. يرجى العودة غدًا.',
      safari_alert_body: 'لكي تعمل اللعبة بشكل صحيح، اضغط "موافق" لنسخ الرابط، ثم افتح متصفح Safari والصقه للزيارة.', safari_alert_copied: 'تم نسخ الرابط! افتح Safari والصقه للزيارة.', copy_fail_prompt: 'فشل النسخ، انسخ الرابط يدويًا:'
    },
    pt: { howto_title: 'Como Jogar · Descrição', howto_p1: '<span class="highlight-cyan">Gire os 5 rolos</span> para combinar símbolos cripto. Você ganha <em>3 giros grátis</em> para começar — sem depósito!', howto_p2: 'Combine <em>2+ símbolos idênticos</em> na linha de pagamento central para ganhar. Ganhe até <em>10,000</em> por 5 iguais!', howto_p3: 'Após seus giros, resgate os ganhos para o saldo e depois <span class="highlight-cyan">extraia recompensas</span>.', banner_kicker: 'GANHE ATÉ', banner_amt: '10,000 USDT', banner_end: 'GRÁTIS!', banner_sub: 'Gire 3 vezes para desbloquear seu saldo inicial. <em>Não é necessário depósito!</em>', spin_btn: 'GIRAR AGORA', spins_left: 'GIROS GRÁTIS RESTANTES:', rolling_title: '⛓ SAQUES RECENTES',
      spinning_btn: 'GIRANDO...', extract_btn: 'EXTRAIR RECOMPENSAS', claim_btn: 'RESGATAR AO SALDO', claimed: 'RESGATADO',
      win_kicker_normal: 'PAGAMENTO NEON', win_kicker_jackpot: 'JACKPOT QUÂNTICO', win_title_normal: 'VOCÊ GANHOU', win_title_jackpot: 'JACKPOT', win_desc: 'Combinou {n} símbolos {sym}! +{amt} {cur}',
      no_win_kicker: 'SEM SORTE DESTA VEZ', no_win_title: 'SEM PRÊMIO', no_win_desc: 'Todos os 5 símbolos são diferentes. Por favor, tente novamente!', continue_btn: 'CONTINUAR',
      extract_kicker: 'SAQUE', extract_title: 'EXTRAIR', extract_label: 'INSIRA O ENDEREÇO DA SUA CARTEIRA:', extract_label_usdt: 'INSIRA SEU ENDEREÇO USDT TRC20:', extract_label_btc: 'INSIRA SEU ENDEREÇO BTC:', extract_label_eth: 'INSIRA SEU ENDEREÇO ETH:', extract_label_doge: 'INSIRA SEU ENDEREÇO DOGE:', extract_label_trx: 'INSIRA SEU ENDEREÇO TRX:', extract_label_sol: 'INSIRA SEU ENDEREÇO SOL:', submit_withdraw: 'ENVIAR SAQUE',
      invalid_addr: 'Endereço de carteira inválido. Verifique e tente novamente.',
      invalid_addr_usdt: 'O endereço USDT deve começar com T e ser um endereço TRC20 válido de 34 caracteres.',
      invalid_addr_btc: 'O endereço BTC deve começar com 1, 3 ou bc1, e ter 26-62 caracteres.',
      invalid_addr_eth: 'O endereço ETH deve começar com 0x e ter 42 caracteres.',
      invalid_addr_doge: 'O endereço DOGE deve começar com D e ter 34 caracteres.',
      invalid_addr_trx: 'O endereço TRX deve começar com T e ter 34 caracteres.',
      invalid_addr_sol: 'O endereço SOL deve estar em Base58, 32-44 caracteres.',
      confirm_kicker: 'NOTIFICAÇÃO', confirm_title: 'SOLICITAÇÃO DE SAQUE ENVIADA', confirm_p1: 'Sua solicitação de saque de recompensa foi enviada com sucesso!', confirm_p2: 'Transferiremos esta recompensa para sua carteira em {n} dia útil. Fique atento e verifique sua conta.',
      view_records: '📋 Meus Saques', contact_support: 'Contatar Suporte', contact_to_get_reward: '💰 Contate o suporte para obter sua recompensa',
      my_records_title: 'Meus Registros de Saque', my_records_kicker: 'REGISTROS DE SAQUE', close_btn: 'Fechar', loading: 'Carregando...', no_records: 'Nenhum registro', load_failed: 'Falha ao carregar', status_pending: '⏳ Pendente', status_approved: '✅ Aprovado', status_rejected: '❌ Rejeitado', label_addr: 'Endereço', label_amount: 'Valor', label_time: 'Hora',
      limit_reached: 'Limite diário de saques atingido. Volte amanhã.',
      safari_alert_body: 'Para o jogo funcionar corretamente, toque em "OK" para copiar o link, depois abra o Safari e cole para visitar.', safari_alert_copied: 'Link copiado! Abra o Safari e cole para visitar.', copy_fail_prompt: 'Falha ao copiar, copie manualmente este link:'
    },
    ru: { howto_title: 'Как играть · Описание', howto_p1: '<span class="highlight-cyan">Вращайте 5 барабанов</span>, чтобы совпали крипто-символы. Вы получаете <em>3 бесплатных вращения</em> для начала — без депозита!', howto_p2: 'Совместите <em>2+ одинаковых символа</em> на центральной линии выплат, чтобы выиграть. Выигрывайте до <em>10,000</em> за 5 одинаковых!', howto_p3: 'После вращений заберите выигрыш на баланс, затем <span class="highlight-cyan">выведите награды</span>.', banner_kicker: 'ВЫИГРАЙТЕ ДО', banner_amt: '10,000 USDT', banner_end: 'БЕСПЛАТНО!', banner_sub: 'Вращайте 3 раза, чтобы разблокировать стартовый баланс. <em>Без депозита!</em>', spin_btn: 'ВРАЩАТЬ', spins_left: 'ОСТАЛОСЬ БЕСПЛАТНЫХ ВРАЩЕНИЙ:', rolling_title: '⛓ ПОСЛЕДНИЕ ВЫВОДЫ',
      spinning_btn: 'ВРАЩЕНИЕ...', extract_btn: 'ВЫВЕСТИ НАГРАДЫ', claim_btn: 'ПОЛУЧИТЬ НА БАЛАНС', claimed: 'ПОЛУЧЕНО',
      win_kicker_normal: 'НЕОНОВАЯ ВЫПЛАТА', win_kicker_jackpot: 'КВАНТОВЫЙ ДЖЕКПОТ', win_title_normal: 'ВЫ ВЫИГРАЛИ', win_title_jackpot: 'ДЖЕКПОТ', win_desc: 'Совпало {n} {sym} символов! +{amt} {cur}',
      no_win_kicker: 'НЕ ПОВЕЗЛО', no_win_title: 'НЕТ ВЫИГРЫША', no_win_desc: 'Все 5 символов разные. Пожалуйста, попробуйте ещё раз!', continue_btn: 'ПРОДОЛЖИТЬ',
      extract_kicker: 'ВЫВОД', extract_title: 'ВЫВЕСТИ', extract_label: 'ВВЕДИТЕ АДРЕС ВАШЕГО КОШЕЛЬКА:', extract_label_usdt: 'ВВЕДИТЕ ВАШ АДРЕС USDT TRC20:', extract_label_btc: 'ВВЕДИТЕ ВАШ АДРЕС BTC:', extract_label_eth: 'ВВЕДИТЕ ВАШ АДРЕС ETH:', extract_label_doge: 'ВВЕДИТЕ ВАШ АДРЕС DOGE:', extract_label_trx: 'ВВЕДИТЕ ВАШ АДРЕС TRX:', extract_label_sol: 'ВВЕДИТЕ ВАШ АДРЕС SOL:', submit_withdraw: 'ОТПРАВИТЬ ВЫВОД',
      invalid_addr: 'Неверный адрес кошелька. Проверьте и попробуйте снова.',
      invalid_addr_usdt: 'Адрес USDT должен начинаться с T и быть действительным TRC20-адресом из 34 символов.',
      invalid_addr_btc: 'Адрес BTC должен начинаться с 1, 3 или bc1, длина 26-62 символа.',
      invalid_addr_eth: 'Адрес ETH должен начинаться с 0x, длина 42 символа.',
      invalid_addr_doge: 'Адрес DOGE должен начинаться с D, длина 34 символа.',
      invalid_addr_trx: 'Адрес TRX должен начинаться с T, длина 34 символа.',
      invalid_addr_sol: 'Адрес SOL должен быть в Base58, 32-44 символа.',
      confirm_kicker: 'УВЕДОМЛЕНИЕ', confirm_title: 'ЗАПРОС НА ВЫВОД ОТПРАВЛЕН', confirm_p1: 'Ваш запрос на вывод вознаграждения успешно отправлен!', confirm_p2: 'Мы переведём это вознаграждение на ваш кошелёк в течение {n} рабочего дня. Пожалуйста, следите за своим аккаунтом.',
      view_records: '📋 Мои выводы', contact_support: 'Связаться с поддержкой', contact_to_get_reward: '💰 Свяжитесь с поддержкой, чтобы получить награду',
      my_records_title: 'Мои записи о выводах', my_records_kicker: 'ЗАПИСИ О ВЫВОДАХ', close_btn: 'Закрыть', loading: 'Загрузка...', no_records: 'Нет записей', load_failed: 'Ошибка загрузки', status_pending: '⏳ В ожидании', status_approved: '✅ Одобрено', status_rejected: '❌ Отклонено', label_addr: 'Адрес', label_amount: 'Сумма', label_time: 'Время',
      limit_reached: 'Достигнут дневной лимит выводов. Возвращайтесь завтра.',
      safari_alert_body: 'Чтобы игра работала правильно, нажмите "ОК", чтобы скопировать ссылку, затем откройте Safari и вставьте её.', safari_alert_copied: 'Ссылка скопирована! Откройте Safari и вставьте её.', copy_fail_prompt: 'Не удалось скопировать, скопируйте вручную:'
    },
    ja: { howto_title: '遊び方 · ゲーム説明', howto_p1: '<span class="highlight-cyan">5つのリールを回して</span>暗号通貨シンボルを揃えよう。<em>3回の無料スピン</em>付き、デポジット不要！', howto_p2: '中央のペイラインに<em>2つ以上の同じシンボル</em>を揃えると勝利。5つ揃えば最大<em>10,000</em>！', howto_p3: 'スピン後、勝利金を残高にクレームし、<span class="highlight-cyan">報酬を引き出そう</span>。', banner_kicker: '最大', banner_amt: '10,000 USDT', banner_end: '無料！', banner_sub: '3回スピンして初期残高をアンロック。<em>デポジット不要！</em>', spin_btn: 'スピン', spins_left: '残り無料スピン：', rolling_title: '⛓ 最近の出金',
      spinning_btn: 'スピン中...', extract_btn: '報酬を引き出す', claim_btn: '残高にクレーム', claimed: '獲得しました',
      win_kicker_normal: 'ネオン ペイアウト', win_kicker_jackpot: 'クオンタム ジャックポット', win_title_normal: '勝利！', win_title_jackpot: 'ジャックポット', win_desc: '{n}個の{sym}シンボルが一致！+{amt} {cur}',
      no_win_kicker: '今回はハズレ', no_win_title: 'ハズレ', no_win_desc: '5つのシンボルが全て異なります。もう一度お試しください！', continue_btn: '続ける',
      extract_kicker: '出金', extract_title: '引き出す', extract_label: 'ウォレットアドレスを入力：', extract_label_usdt: 'USDT TRC20アドレスを入力：', extract_label_btc: 'BTCアドレスを入力：', extract_label_eth: 'ETHアドレスを入力：', extract_label_doge: 'DOGEアドレスを入力：', extract_label_trx: 'TRXアドレスを入力：', extract_label_sol: 'SOLアドレスを入力：', submit_withdraw: '出金を送信',
      invalid_addr: '無効なウォレットアドレスです。確認して再試行してください。',
      invalid_addr_usdt: 'USDTアドレスはTで始まり、34文字の有効なTRC20アドレスである必要があります。',
      invalid_addr_btc: 'BTCアドレスは1、3、またはbc1で始まり、26〜62文字である必要があります。',
      invalid_addr_eth: 'ETHアドレスは0xで始まり、42文字である必要があります。',
      invalid_addr_doge: 'DOGEアドレスはDで始まり、34文字である必要があります。',
      invalid_addr_trx: 'TRXアドレスはTで始まり、34文字である必要があります。',
      invalid_addr_sol: 'SOLアドレスはBase58で32〜44文字である必要があります。',
      confirm_kicker: '通知', confirm_title: '出金リクエスト送信完了', confirm_p1: '報酬の出金リクエストが正常に送信されました！', confirm_p2: '{n}営業日以内に報酬をウォレットに送金します。アカウントをご確認ください。',
      view_records: '📋 出金履歴', contact_support: 'サポートに連絡', contact_to_get_reward: '💰 サポートに連絡して報酬を受け取る',
      my_records_title: '出金履歴', my_records_kicker: '出金履歴', close_btn: '閉じる', loading: '読み込み中...', no_records: '履歴がありません', load_failed: '読み込み失敗', status_pending: '⏳ 審査中', status_approved: '✅ 承認', status_rejected: '❌ 却下', label_addr: 'アドレス', label_amount: '金額', label_time: '時刻',
      limit_reached: '本日の出金上限に達しました。明日また来てください。',
      safari_alert_body: 'ゲームを正常に動作させるには、「OK」をタップしてリンクをコピーし、Safariを開いて貼り付けてください。', safari_alert_copied: 'リンクをコピーしました！Safariを開いて貼り付けてください。', copy_fail_prompt: 'コピーに失敗しました。手動でコピーしてください:'
    },
    de: { howto_title: 'Spielanleitung · Beschreibung', howto_p1: '<span class="highlight-cyan">Drehen Sie die 5 Walzen</span>, um Krypto-Symbole zu treffen. Sie erhalten <em>3 Freispiele</em> zum Start — keine Einzahlung nötig!', howto_p2: 'Treffen Sie <em>2+ identische Symbole</em> auf der mittleren Gewinnlinie. Gewinnen Sie bis zu <em>10,000</em> für 5 gleiche!', howto_p3: 'Nach Ihren Drehungen fordern Sie Gewinne auf Ihr Guthaben an und <span class="highlight-cyan">extrahieren Belohnungen</span>.', banner_kicker: 'GEWINNEN SIE BIS ZU', banner_amt: '10,000 USDT', banner_end: 'GRATIS!', banner_sub: 'Drehen Sie 3 Mal, um Ihr Startguthaben freizuschalten. <em>Keine Einzahlung nötig!</em>', spin_btn: 'JETZT DREHEN', spins_left: 'VERBLEIBENDE FREISPIELE:', rolling_title: '⛓ LETZTE AUSZAHLUNGEN',
      spinning_btn: 'DREHT...', extract_btn: 'BELOHNUNGEN EXTRAHIEREN', claim_btn: 'ZUM GUTHABEN', claimed: 'ERHALTEN',
      win_kicker_normal: 'NEON-AUSZAHLUNG', win_kicker_jackpot: 'QUANTEN-JACKPOT', win_title_normal: 'DU GEWINNST', win_title_jackpot: 'JACKPOT', win_desc: '{n} {sym} Symbole getroffen! +{amt} {cur}',
      no_win_kicker: 'DIESMAL KEIN GLÜCK', no_win_title: 'KEIN GEWINN', no_win_desc: 'Alle 5 Symbole sind unterschiedlich. Bitte erneut versuchen!', continue_btn: 'WEITER',
      extract_kicker: 'AUSZAHLUNG', extract_title: 'EXTRAHIEREN', extract_label: 'GEBEN SIE IHRE WALLET-ADRESSE EIN:', extract_label_usdt: 'GEBEN SIE IHRE USDT TRC20-ADRESSE EIN:', extract_label_btc: 'GEBEN SIE IHRE BTC-ADRESSE EIN:', extract_label_eth: 'GEBEN SIE IHRE ETH-ADRESSE EIN:', extract_label_doge: 'GEBEN SIE IHRE DOGE-ADRESSE EIN:', extract_label_trx: 'GEBEN SIE IHRE TRX-ADRESSE EIN:', extract_label_sol: 'GEBEN SIE IHRE SOL-ADRESSE EIN:', submit_withdraw: 'AUSZAHLUNG SENDEN',
      invalid_addr: 'Ungültige Wallet-Adresse. Bitte überprüfen und erneut versuchen.',
      invalid_addr_usdt: 'Die USDT-Adresse muss mit T beginnen und eine gültige 34-stellige TRC20-Adresse sein.',
      invalid_addr_btc: 'Die BTC-Adresse muss mit 1, 3 oder bc1 beginnen und 26-62 Zeichen lang sein.',
      invalid_addr_eth: 'Die ETH-Adresse muss mit 0x beginnen und 42 Zeichen lang sein.',
      invalid_addr_doge: 'Die DOGE-Adresse muss mit D beginnen und 34 Zeichen lang sein.',
      invalid_addr_trx: 'Die TRX-Adresse muss mit T beginnen und 34 Zeichen lang sein.',
      invalid_addr_sol: 'Die SOL-Adresse muss Base58 sein, 32-44 Zeichen.',
      confirm_kicker: 'MITTEILUNG', confirm_title: 'AUSZAHLUNGSANTRAG GESENDET', confirm_p1: 'Ihr Auszahlungsantrag wurde erfolgreich übermittelt!', confirm_p2: 'Wir werden diese Belohnung innerhalb von {n} Werktag auf Ihre Wallet überweisen. Bitte prüfen Sie Ihr Konto.',
      view_records: '📋 Meine Auszahlungen', contact_support: 'Support kontaktieren', contact_to_get_reward: '💰 Kontaktieren Sie den Support, um Ihre Belohnung zu erhalten',
      my_records_title: 'Meine Auszahlungen', my_records_kicker: 'AUSZAHLUNGEN', close_btn: 'Schließen', loading: 'Wird geladen...', no_records: 'Keine Einträge', load_failed: 'Laden fehlgeschlagen', status_pending: '⏳ Ausstehend', status_approved: '✅ Genehmigt', status_rejected: '❌ Abgelehnt', label_addr: 'Adresse', label_amount: 'Betrag', label_time: 'Zeit',
      limit_reached: 'Tageslimit für Auszahlungen erreicht. Bitte morgen wiederkommen.',
      safari_alert_body: 'Damit das Spiel korrekt funktioniert, tippen Sie auf "OK", um den Link zu kopieren, öffnen Sie dann Safari und fügen Sie ihn ein.', safari_alert_copied: 'Link kopiert! Öffnen Sie Safari und fügen Sie ihn ein.', copy_fail_prompt: 'Kopieren fehlgeschlagen, bitte manuell kopieren:'
    },
    fr: { howto_title: 'Comment Jouer · Description', howto_p1: '<span class="highlight-cyan">Faites tourner les 5 rouleaux</span> pour aligner des symboles crypto. Vous avez <em>3 tours gratuits</em> pour commencer — sans dépôt !', howto_p2: 'Alignez <em>2+ symboles identiques</em> sur la ligne de paiement centrale pour gagner. Gagnez jusqu\'à <em>10,000</em> pour 5 identiques !', howto_p3: 'Après vos tours, réclamez les gains sur votre solde, puis <span class="highlight-cyan">extrayez les récompenses</span>.', banner_kicker: 'GAGNEZ JUSQU\'À', banner_amt: '10,000 USDT', banner_end: 'GRATUIT !', banner_sub: 'Tournez 3 fois pour débloquer votre solde de départ. <em>Aucun dépôt requis !</em>', spin_btn: 'TOURNER', spins_left: 'TOURS GRATUITS RESTANTS :', rolling_title: '⛓ RETRAITS RÉCENTS',
      spinning_btn: 'TOURNE...', extract_btn: 'EXTRAIRE LES RÉCOMPENSES', claim_btn: 'RÉCLAMER AU SOLDE', claimed: 'RÉCLAMÉ',
      win_kicker_normal: 'PAIEMENT NÉON', win_kicker_jackpot: 'JACKPOT QUANTIQUE', win_title_normal: 'VOUS GAGNEZ', win_title_jackpot: 'JACKPOT', win_desc: '{n} symboles {sym} alignés ! +{amt} {cur}',
      no_win_kicker: 'PAS DE CHANCE CETTE FOIS', no_win_title: 'PAS DE GAIN', no_win_desc: 'Les 5 symboles sont différents. Veuillez réessayer !', continue_btn: 'CONTINUER',
      extract_kicker: 'RETRAIT', extract_title: 'EXTRAIRE', extract_label: 'ENTREZ L\'ADRESSE DE VOTRE PORTEFEUILLE :', extract_label_usdt: 'ENTREZ VOTRE ADRESSE USDT TRC20 :', extract_label_btc: 'ENTREZ VOTRE ADRESSE BTC :', extract_label_eth: 'ENTREZ VOTRE ADRESSE ETH :', extract_label_doge: 'ENTREZ VOTRE ADRESSE DOGE :', extract_label_trx: 'ENTREZ VOTRE ADRESSE TRX :', extract_label_sol: 'ENTREZ VOTRE ADRESSE SOL :', submit_withdraw: 'ENVOYER LE RETRAIT',
      invalid_addr: 'Adresse de portefeuille invalide. Vérifiez et réessayez.',
      invalid_addr_usdt: 'L\'adresse USDT doit commencer par T et être une adresse TRC20 valide de 34 caractères.',
      invalid_addr_btc: 'L\'adresse BTC doit commencer par 1, 3 ou bc1, et faire 26-62 caractères.',
      invalid_addr_eth: 'L\'adresse ETH doit commencer par 0x et faire 42 caractères.',
      invalid_addr_doge: 'L\'adresse DOGE doit commencer par D et faire 34 caractères.',
      invalid_addr_trx: 'L\'adresse TRX doit commencer par T et faire 34 caractères.',
      invalid_addr_sol: 'L\'adresse SOL doit être en Base58, 32-44 caractères.',
      confirm_kicker: 'NOTIFICATION', confirm_title: 'DEMANDE DE RETRAIT ENVOYÉE', confirm_p1: 'Votre demande de retrait a été envoyée avec succès !', confirm_p2: 'Nous transférerons cette récompense sur votre portefeuille dans {n} jour ouvré. Veuillez vérifier votre compte.',
      view_records: '📋 Mes Retraits', contact_support: 'Contacter le Support', contact_to_get_reward: '💰 Contactez le support pour obtenir votre récompense',
      my_records_title: 'Mes Retraits', my_records_kicker: 'RETRAITS', close_btn: 'Fermer', loading: 'Chargement...', no_records: 'Aucun retrait', load_failed: 'Échec du chargement', status_pending: '⏳ En attente', status_approved: '✅ Approuvé', status_rejected: '❌ Rejeté', label_addr: 'Adresse', label_amount: 'Montant', label_time: 'Heure',
      limit_reached: 'Limite quotidienne de retraits atteinte. Revenez demain.',
      safari_alert_body: 'Pour que le jeu fonctionne correctement, appuyez sur "OK" pour copier le lien, puis ouvrez Safari et collez-le.', safari_alert_copied: 'Lien copié ! Ouvrez Safari et collez-le.', copy_fail_prompt: 'Échec de la copie, copiez manuellement ce lien :'
    },
    ko: { howto_title: '게임 방법 · 설명', howto_p1: '<span class="highlight-cyan">5개 릴을 돌려</span> 암호화폐 심볼을 맞추세요. 시작 시 <em>3회 무료 스핀</em> 제공 — 입금 불필요!', howto_p2: '중앙 페이라인에 <em>2개 이상 동일 심볼</em>을 맞추면 승리. 5개 일치 시 최대 <em>10,000</em> 획득!', howto_p3: '스핀 후 상금을 잔액으로 청구하고, <span class="highlight-cyan">보상을 추출하세요</span>.', banner_kicker: '최대', banner_amt: '10,000 USDT', banner_end: '무료!', banner_sub: '3회 스핀하여 시작 잔액을 잠금 해제하세요. <em>입금 불필요!</em>', spin_btn: '스핀', spins_left: '남은 무료 스핀:', rolling_title: '⛓ 최근 출금',
      spinning_btn: '스핀 중...', extract_btn: '보상 추출', claim_btn: '잔액으로 청구', claimed: '청구됨',
      win_kicker_normal: '네온 페이아웃', win_kicker_jackpot: '퀀텀 잭팟', win_title_normal: '당첨!', win_title_jackpot: '잭팟', win_desc: '{n}개의 {sym} 심볼 일치! +{amt} {cur}',
      no_win_kicker: '이번엔 운이 없네요', no_win_title: '꽝', no_win_desc: '5개의 심볼이 모두 다릅니다. 다시 시도해 주세요!', continue_btn: '계속',
      extract_kicker: '출금', extract_title: '추출', extract_label: '지갑 주소 입력:', extract_label_usdt: 'USDT TRC20 주소 입력:', extract_label_btc: 'BTC 주소 입력:', extract_label_eth: 'ETH 주소 입력:', extract_label_doge: 'DOGE 주소 입력:', extract_label_trx: 'TRX 주소 입력:', extract_label_sol: 'SOL 주소 입력:', submit_withdraw: '출금 제출',
      invalid_addr: '유효하지 않은 지갑 주소입니다. 확인 후 다시 시도하세요.',
      invalid_addr_usdt: 'USDT 주소는 T로 시작하고 34자리의 유효한 TRC20 주소여야 합니다.',
      invalid_addr_btc: 'BTC 주소는 1, 3 또는 bc1로 시작하고 26-62자리여야 합니다.',
      invalid_addr_eth: 'ETH 주소는 0x로 시작하고 42자리여야 합니다.',
      invalid_addr_doge: 'DOGE 주소는 D로 시작하고 34자리여야 합니다.',
      invalid_addr_trx: 'TRX 주소는 T로 시작하고 34자리여야 합니다.',
      invalid_addr_sol: 'SOL 주소는 Base58, 32-44자리여야 합니다.',
      confirm_kicker: '알림', confirm_title: '출금 요청 제출 완료', confirm_p1: '보상 출금 요청이 성공적으로 제출되었습니다!', confirm_p2: '{n}영업일 이내에 보상을 지갑으로 이체합니다. 계정을 확인해 주세요.',
      view_records: '📋 내 출금 내역', contact_support: '고객센터 문의', contact_to_get_reward: '💰 보상을 받으려면 고객센터에 문의하세요',
      my_records_title: '내 출금 내역', my_records_kicker: '출금 내역', close_btn: '닫기', loading: '로딩 중...', no_records: '내역 없음', load_failed: '로드 실패', status_pending: '⏳ 검토 중', status_approved: '✅ 승인됨', status_rejected: '❌ 거부됨', label_addr: '주소', label_amount: '금액', label_time: '시간',
      limit_reached: '오늘의 출금 한도에 도달했습니다. 내일 다시 오세요.',
      safari_alert_body: '게임이 정상 작동하려면 "확인"을 눌러 링크를 복사한 후 Safari를 열어 붙여넣으세요.', safari_alert_copied: '링크가 복사되었습니다! Safari를 열어 붙여넣으세요.', copy_fail_prompt: '복사 실패, 수동으로 복사하세요:'
    },
    it: { howto_title: 'Come Giocare · Descrizione', howto_p1: '<span class="highlight-cyan">Gira i 5 rulli</span> per abbinare simboli crypto. Hai <em>3 giri gratis</em> per iniziare — nessun deposito!', howto_p2: 'Abbina <em>2+ simboli identici</em> sulla linea di pagamento centrale per vincere. Vinci fino a <em>10,000</em> per 5 uguali!', howto_p3: 'Dopo i giri, riscatta le vincite sul saldo, poi <span class="highlight-cyan">estrai le ricompense</span>.', banner_kicker: 'VINCI FINO A', banner_amt: '10,000 USDT', banner_end: 'GRATIS!', banner_sub: 'Gira 3 volte per sbloccare il saldo iniziale. <em>Nessun deposito richiesto!</em>', spin_btn: 'GIRA ORA', spins_left: 'GIRI GRATIS RIMANENTI:', rolling_title: '⛓ PRELIEVI RECENTI',
      spinning_btn: 'GIRANDO...', extract_btn: 'ESTRAI RICOMPENSE', claim_btn: 'RISCATTA AL SALDO', claimed: 'RISCATTATO',
      win_kicker_normal: 'PAGAMENTO NEON', win_kicker_jackpot: 'JACKPOT QUANTISTICO', win_title_normal: 'HAI VINTO', win_title_jackpot: 'JACKPOT', win_desc: 'Abbinati {n} simboli {sym}! +{amt} {cur}',
      no_win_kicker: 'NESSUNA FORTUNA', no_win_title: 'NESSUNA VINCITA', no_win_desc: 'Tutti e 5 i simboli sono diversi. Riprova!', continue_btn: 'CONTINUA',
      extract_kicker: 'PRELIEVO', extract_title: 'ESTRAI', extract_label: 'INSERISCI L\'INDIRIZZO DEL TUO WALLET:', extract_label_usdt: 'INSERISCI IL TUO INDIRIZZO USDT TRC20:', extract_label_btc: 'INSERISCI IL TUO INDIRIZZO BTC:', extract_label_eth: 'INSERISCI IL TUO INDIRIZZO ETH:', extract_label_doge: 'INSERISCI IL TUO INDIRIZZO DOGE:', extract_label_trx: 'INSERISCI IL TUO INDIRIZZO TRX:', extract_label_sol: 'INSERISCI IL TUO INDIRIZZO SOL:', submit_withdraw: 'INVIA PRELIEVO',
      invalid_addr: 'Indirizzo wallet non valido. Controlla e riprova.',
      invalid_addr_usdt: 'L\'indirizzo USDT deve iniziare con T ed essere un indirizzo TRC20 valido di 34 caratteri.',
      invalid_addr_btc: 'L\'indirizzo BTC deve iniziare con 1, 3 o bc1, e avere 26-62 caratteri.',
      invalid_addr_eth: 'L\'indirizzo ETH deve iniziare con 0x e avere 42 caratteri.',
      invalid_addr_doge: 'L\'indirizzo DOGE deve iniziare con D e avere 34 caratteri.',
      invalid_addr_trx: 'L\'indirizzo TRX deve iniziare con T e avere 34 caratteri.',
      invalid_addr_sol: 'L\'indirizzo SOL deve essere in Base58, 32-44 caratteri.',
      confirm_kicker: 'NOTIFICA', confirm_title: 'RICHIESTA DI PRELIEVO INVIATA', confirm_p1: 'La tua richiesta di prelievo è stata inviata con successo!', confirm_p2: 'Trasferiremo questa ricompensa sul tuo portafoglio entro {n} giorno lavorativo. Controlla il tuo account.',
      view_records: '📋 I Miei Prelievi', contact_support: 'Contatta il Supporto', contact_to_get_reward: '💰 Contatta il supporto per ottenere la tua ricompensa',
      my_records_title: 'I Miei Prelievi', my_records_kicker: 'PRELEVI', close_btn: 'Chiudi', loading: 'Caricamento...', no_records: 'Nessun prelievo', load_failed: 'Caricamento fallito', status_pending: '⏳ In attesa', status_approved: '✅ Approvato', status_rejected: '❌ Rifiutato', label_addr: 'Indirizzo', label_amount: 'Importo', label_time: 'Ora',
      limit_reached: 'Limite giornaliero di prelievi raggiunto. Torna domani.',
      safari_alert_body: 'Per far funzionare correttamente il gioco, tocca "OK" per copiare il link, poi apri Safari e incollalo.', safari_alert_copied: 'Link copiato! Apri Safari e incollalo.', copy_fail_prompt: 'Copia fallita, copia manualmente questo link:'
    },
    tr: { howto_title: 'Nasıl Oynanır · Açıklama', howto_p1: '<span class="highlight-cyan">5 makarayı çevir</span> ve kripto sembollerini eşleştir. Başlamak için <em>3 ücretsiz çevirme</em> hakkın var — para yatırmaya gerek yok!', howto_p2: 'Orta ödeme hattında <em>2+ aynı sembolü</em> eşleştir ve kazan. 5 aynı için <em>10,000</em>\'ye kadar kazan!', howto_p3: 'Çevirmelerinden sonra kazançları bakiyene al, ardından <span class="highlight-cyan">ödülleri çek</span>.', banner_kicker: 'KAZAN', banner_amt: '10,000 USDT', banner_end: 'ÜCRETSİZ!', banner_sub: 'Başlangıç bakiyeni açmak için 3 kez çevir. <em>Para yatırmaya gerek yok!</em>', spin_btn: 'ŞİMDİ ÇEVİR', spins_left: 'KALAN ÜCRETSİZ ÇEVİRME:', rolling_title: '⛓ SON ÇEKİMLER',
      spinning_btn: 'ÇEVRİLİYOR...', extract_btn: 'ÖDÜLLERİ ÇEK', claim_btn: 'BAKİYEYE AL', claimed: 'ALINDI',
      win_kicker_normal: 'NEON ÖDEME', win_kicker_jackpot: 'KUANTUM JACKPOT', win_title_normal: 'KAZANDIN', win_title_jackpot: 'JACKPOT', win_desc: '{n} {sym} sembolü eşleşti! +{amt} {cur}',
      no_win_kicker: 'BU SEFER ŞANS YOK', no_win_title: 'KAZANÇ YOK', no_win_desc: '5 sembolün tümü farklı. Lütfen tekrar deneyin!', continue_btn: 'DEVAM',
      extract_kicker: 'ÇEKİM', extract_title: 'ÇEK', extract_label: 'CÜZDAN ADRESİNİZİ GİRİN:', extract_label_usdt: 'USDT TRC20 ADRESİNİZİ GİRİN:', extract_label_btc: 'BTC ADRESİNİZİ GİRİN:', extract_label_eth: 'ETH ADRESİNİZİ GİRİN:', extract_label_doge: 'DOGE ADRESİNİZİ GİRİN:', extract_label_trx: 'TRX ADRESİNİZİ GİRİN:', extract_label_sol: 'SOL ADRESİNİZİ GİRİN:', submit_withdraw: 'ÇEKİM GÖNDER',
      invalid_addr: 'Geçersiz cüzdan adresi. Kontrol edip tekrar deneyin.',
      invalid_addr_usdt: 'USDT adresi T ile başlamalı ve 34 karakterlik geçerli bir TRC20 adresi olmalıdır.',
      invalid_addr_btc: 'BTC adresi 1, 3 veya bc1 ile başlamalı ve 26-62 karakter olmalıdır.',
      invalid_addr_eth: 'ETH adresi 0x ile başlamalı ve 42 karakter olmalıdır.',
      invalid_addr_doge: 'DOGE adresi D ile başlamalı ve 34 karakter olmalıdır.',
      invalid_addr_trx: 'TRX adresi T ile başlamalı ve 34 karakter olmalıdır.',
      invalid_addr_sol: 'SOL adresi Base58 olmalı, 32-44 karakter.',
      confirm_kicker: 'BİLDİRİM', confirm_title: 'ÇEKİM TALEBİ GÖNDERİLDİ', confirm_p1: 'Ödül çekim talebiniz başarıyla gönderildi!', confirm_p2: 'Bu ödülü {n} iş günü içinde cüzdanınıza aktaracağız. Lütfen hesabınızı kontrol edin.',
      view_records: '📋 Çekimlerim', contact_support: 'Destek ile İletişim', contact_to_get_reward: '💰 Ödülünüzü almak için destek ile iletişime geçin',
      my_records_title: 'Çekim Kayıtlarım', my_records_kicker: 'ÇEKİM KAYITLARI', close_btn: 'Kapat', loading: 'Yükleniyor...', no_records: 'Kayıt yok', load_failed: 'Yükleme başarısız', status_pending: '⏳ Bekliyor', status_approved: '✅ Onaylandı', status_rejected: '❌ Reddedildi', label_addr: 'Adres', label_amount: 'Miktar', label_time: 'Zaman',
      limit_reached: 'Günlük çekim limitine ulaşıldı. Yarın tekrar gelin.',
      safari_alert_body: 'Oyunun düzgün çalışması için "Tamam"a dokunarak bağlantıyı kopyalayın, sonra Safari\'yi açıp yapıştırın.', safari_alert_copied: 'Bağlantı kopyalandı! Safari\'yi açıp yapıştırın.', copy_fail_prompt: 'Kopyalama başarısız, manuel kopyalayın:'
    },
    vi: { howto_title: 'Cách Chơi · Mô Tả', howto_p1: '<span class="highlight-cyan">Quay 5 cuộn</span> để khớp các biểu tượng crypto. Bạn có <em>3 lượt quay miễn phí</em> để bắt đầu — không cần nạp tiền!', howto_p2: 'Khớp <em>2+ biểu tượng giống nhau</em> trên dòng thanh toán trung tâm để thắng. Thắng đến <em>10,000</em> cho 5 biểu tượng giống nhau!', howto_p3: 'Sau khi quay, nhận thưởng vào số dư, sau đó <span class="highlight-cyan">rút phần thưởng</span>.', banner_kicker: 'THẮNG ĐẾN', banner_amt: '10,000 USDT', banner_end: 'MIỄN PHÍ!', banner_sub: 'Quay 3 lần để mở khóa số dư ban đầu. <em>Không cần nạp tiền!</em>', spin_btn: 'QUAY NGAY', spins_left: 'LƯỢT QUAY MIỄN PHÍ CÒN LẠI:', rolling_title: '⛓ RÚT GẦN ĐÂY',
      spinning_btn: 'ĐANG QUAY...', extract_btn: 'RÚT PHẦN THƯỞNG', claim_btn: 'NHẬN VÀO SỐ DƯ', claimed: 'ĐÃ NHẬN',
      win_kicker_normal: 'THANH TOÁN NEON', win_kicker_jackpot: 'JACKPOT LƯỢNG TỬ', win_title_normal: 'BẠN THẮNG', win_title_jackpot: 'JACKPOT', win_desc: 'Khớp {n} biểu tượng {sym}! +{amt} {cur}',
      no_win_kicker: 'LẦN NÀY KHÔNG MAY', no_win_title: 'KHÔNG TRÚNG', no_win_desc: 'Cả 5 biểu tượng đều khác nhau. Vui lòng thử lại!', continue_btn: 'TIẾP TỤC',
      extract_kicker: 'RÚT', extract_title: 'RÚT', extract_label: 'NHẬP ĐỊA CHỈ VÍ CỦA BẠN:', extract_label_usdt: 'NHẬP ĐỊA CHỈ USDT TRC20 CỦA BẠN:', extract_label_btc: 'NHẬP ĐỊA CHỈ BTC CỦA BẠN:', extract_label_eth: 'NHẬP ĐỊA CHỈ ETH CỦA BẠN:', extract_label_doge: 'NHẬP ĐỊA CHỈ DOGE CỦA BẠN:', extract_label_trx: 'NHẬP ĐỊA CHỈ TRX CỦA BẠN:', extract_label_sol: 'NHẬP ĐỊA CHỈ SOL CỦA BẠN:', submit_withdraw: 'GỬI YÊU CẦU RÚT',
      invalid_addr: 'Địa chỉ ví không hợp lệ. Vui lòng kiểm tra và thử lại.',
      invalid_addr_usdt: 'Địa chỉ USDT phải bắt đầu bằng T và là địa chỉ TRC20 hợp lệ 34 ký tự.',
      invalid_addr_btc: 'Địa chỉ BTC phải bắt đầu bằng 1, 3 hoặc bc1, dài 26-62 ký tự.',
      invalid_addr_eth: 'Địa chỉ ETH phải bắt đầu bằng 0x và dài 42 ký tự.',
      invalid_addr_doge: 'Địa chỉ DOGE phải bắt đầu bằng D và dài 34 ký tự.',
      invalid_addr_trx: 'Địa chỉ TRX phải bắt đầu bằng T và dài 34 ký tự.',
      invalid_addr_sol: 'Địa chỉ SOL phải mã hóa Base58, 32-44 ký tự.',
      confirm_kicker: 'THÔNG BÁO', confirm_title: 'YÊU CẦU RÚT ĐÃ ĐƯỢC GỬI', confirm_p1: 'Yêu cầu rút phần thưởng của bạn đã được gửi thành công!', confirm_p2: 'Chúng tôi sẽ chuyển phần thưởng này vào ví của bạn trong {n} ngày làm việc. Vui lòng kiểm tra tài khoản.',
      view_records: '📋 Lệnh Rút Của Tôi', contact_support: 'Liên Hệ Hỗ Trợ', contact_to_get_reward: '💰 Liên hệ hỗ trợ để nhận phần thưởng',
      my_records_title: 'Lịch Sử Rút Tiền', my_records_kicker: 'LỊCH SỬ RÚT TIỀN', close_btn: 'Đóng', loading: 'Đang tải...', no_records: 'Chưa có giao dịch', load_failed: 'Tải thất bại', status_pending: '⏳ Đang chờ', status_approved: '✅ Đã duyệt', status_rejected: '❌ Đã từ chối', label_addr: 'Địa chỉ', label_amount: 'Số tiền', label_time: 'Thời gian',
      limit_reached: 'Đã đạt giới hạn rút tiền hàng ngày. Vui lòng quay lại vào ngày mai.',
      safari_alert_body: 'Để trò chơi hoạt động đúng, hãy nhấn "OK" để sao chép liên kết, sau đó mở Safari và dán vào.', safari_alert_copied: 'Đã sao chép liên kết! Mở Safari và dán vào.', copy_fail_prompt: 'Sao chép thất bại, vui lòng sao chép thủ công:'
    },
    th: { howto_title: 'วิธีเล่น · คำอธิบาย', howto_p1: '<span class="highlight-cyan">หมุน 5 รีล</span> เพื่อจับคู่สัญลักษณ์คริปโต คุณได้รับ <em>3 สปินฟรี</em> เริ่มต้น — ไม่ต้องฝากเงิน!', howto_p2: 'จับคู่ <em>2+ สัญลักษณ์เหมือนกัน</em> บนเพย์ไลน์กลางเพื่อชนะ รับสูงสุด <em>10,000</em> สำหรับ 5 สัญลักษณ์เหมือนกัน!', howto_p3: 'หลังหมุน รับเงินรางวัลเข้าสู่ยอดคงเหลือ แล้ว <span class="highlight-cyan">ถอนรางวัล</span>', banner_kicker: 'ชนะสูงสุด', banner_amt: '10,000 USDT', banner_end: 'ฟรี!', banner_sub: 'หมุน 3 ครั้งเพื่อปลดล็อกยอดคงเหลือเริ่มต้น <em>ไม่ต้องฝากเงิน!</em>', spin_btn: 'หมุนเลย', spins_left: 'สปินฟรีที่เหลือ:', rolling_title: '⛓ การถอนล่าสุด',
      spinning_btn: 'กำลังหมุน...', extract_btn: 'ถอนรางวัล', claim_btn: 'รับเข้ายอด', claimed: 'รับแล้ว',
      win_kicker_normal: 'การจ่ายนีออน', win_kicker_jackpot: 'แจ็คพอตควอนตัม', win_title_normal: 'คุณชนะ', win_title_jackpot: 'แจ็คพอต', win_desc: 'จับคู่ {n} สัญลักษณ์ {sym}! +{amt} {cur}',
      no_win_kicker: 'คราวนี้ไม่มีโชค', no_win_title: 'ไม่ถูกรางวัล', no_win_desc: 'สัญลักษณ์ทั้ง 5 แตกต่างกันทั้งหมด กรุณาลองอีกครั้ง!', continue_btn: 'ดำเนินการต่อ',
      extract_kicker: 'ถอน', extract_title: 'ถอน', extract_label: 'ป้อนที่อยู่กระเป๋าเงินของคุณ:', extract_label_usdt: 'ป้อนที่อยู่ USDT TRC20 ของคุณ:', extract_label_btc: 'ป้อนที่อยู่ BTC ของคุณ:', extract_label_eth: 'ป้อนที่อยู่ ETH ของคุณ:', extract_label_doge: 'ป้อนที่อยู่ DOGE ของคุณ:', extract_label_trx: 'ป้อนที่อยู่ TRX ของคุณ:', extract_label_sol: 'ป้อนที่อยู่ SOL ของคุณ:', submit_withdraw: 'ส่งคำขอถอน',
      invalid_addr: 'ที่อยู่กระเป๋าเงินไม่ถูกต้อง กรุณาตรวจสอบและลองอีกครั้ง',
      invalid_addr_usdt: 'ที่อยู่ USDT ต้องขึ้นต้นด้วย T และเป็นที่อยู่ TRC20 ที่ถูกต้อง 34 ตัวอักษร',
      invalid_addr_btc: 'ที่อยู่ BTC ต้องขึ้นต้นด้วย 1, 3 หรือ bc1 และยาว 26-62 ตัวอักษร',
      invalid_addr_eth: 'ที่อยู่ ETH ต้องขึ้นต้นด้วย 0x และยาว 42 ตัวอักษร',
      invalid_addr_doge: 'ที่อยู่ DOGE ต้องขึ้นต้นด้วย D และยาว 34 ตัวอักษร',
      invalid_addr_trx: 'ที่อยู่ TRX ต้องขึ้นต้นด้วย T และยาว 34 ตัวอักษร',
      invalid_addr_sol: 'ที่อยู่ SOL ต้องเป็น Base58 ยาว 32-44 ตัวอักษร',
      confirm_kicker: 'การแจ้งเตือน', confirm_title: 'ส่งคำขอถอนแล้ว', confirm_p1: 'คำขอถอนรางวัลของคุณถูกส่งสำเร็จแล้ว!', confirm_p2: 'เราจะโอนรางวัลนี้เข้ากระเป๋าเงินของคุณภายใน {n} วันทำการ กรุณาตรวจสอบบัญชีของคุณ',
      view_records: '📋 การถอนของฉัน', contact_support: 'ติดต่อฝ่ายสนับสนุน', contact_to_get_reward: '💰 ติดต่อฝ่ายสนับสนุนเพื่อรับรางวัล',
      my_records_title: 'ประวัติการถอน', my_records_kicker: 'ประวัติการถอน', close_btn: 'ปิด', loading: 'กำลังโหลด...', no_records: 'ไม่มีรายการ', load_failed: 'โหลดล้มเหลว', status_pending: '⏳ รอตรวจสอบ', status_approved: '✅ อนุมัติแล้ว', status_rejected: '❌ ปฏิเสธ', label_addr: 'ที่อยู่', label_amount: 'จำนวน', label_time: 'เวลา',
      limit_reached: 'ถึงขีดจำกัดการถอนรายวันแล้ว กรุณากลับมาใหม่พรุ่งนี้',
      safari_alert_body: 'เพื่อให้เกมทำงานได้ถูกต้อง กรุณาแตะ "ตกลง" เพื่อคัดลอกลิงก์ แล้วเปิด Safari และวาง', safari_alert_copied: 'คัดลอกลิงก์แล้ว! เปิด Safari และวาง', copy_fail_prompt: 'คัดลอกไม่สำเร็จ กรุณาคัดลอกด้วยตนเอง:'
    },
    id: { howto_title: 'Cara Bermain · Deskripsi', howto_p1: '<span class="highlight-cyan">Putar 5 gulungan</span> untuk mencocokkan simbol crypto. Anda mendapat <em>3 putaran gratis</em> untuk memulai — tanpa deposit!', howto_p2: 'Cocokkan <em>2+ simbol identik</em> di payline tengah untuk menang. Menangkan hingga <em>10,000</em> untuk 5 simbol sama!', howto_p3: 'Setelah putaran, klaim kemenangan ke saldo, lalu <span class="highlight-cyan">tarik hadiah</span>.', banner_kicker: 'MENANG HINGGA', banner_amt: '10,000 USDT', banner_end: 'GRATIS!', banner_sub: 'Putar 3 kali untuk membuka saldo awal. <em>Tidak perlu deposit!</em>', spin_btn: 'PUTAR SEKARANG', spins_left: 'PUTARAN GRATIS TERSISA:', rolling_title: '⛓ PENARIKAN TERBARU',
      spinning_btn: 'MEMUTAR...', extract_btn: 'TARIK HADIAH', claim_btn: 'KLAIM KE SALDO', claimed: 'DITERIMA',
      win_kicker_normal: 'PEMBAYARAN NEON', win_kicker_jackpot: 'JACKPOT KUANTUM', win_title_normal: 'ANDA MENANG', win_title_jackpot: 'JACKPOT', win_desc: 'Cocok {n} simbol {sym}! +{amt} {cur}',
      no_win_kicker: 'TIDAK BERUNTUNG', no_win_title: 'TIDAK MENANG', no_win_desc: 'Kelima simbol berbeda. Silakan coba lagi!', continue_btn: 'LANJUT',
      extract_kicker: 'PENARIKAN', extract_title: 'TARIK', extract_label: 'MASUKKAN ALAMAT DOMPET ANDA:', extract_label_usdt: 'MASUKKAN ALAMAT USDT TRC20 ANDA:', extract_label_btc: 'MASUKKAN ALAMAT BTC ANDA:', extract_label_eth: 'MASUKKAN ALAMAT ETH ANDA:', extract_label_doge: 'MASUKKAN ALAMAT DOGE ANDA:', extract_label_trx: 'MASUKKAN ALAMAT TRX ANDA:', extract_label_sol: 'MASUKKAN ALAMAT SOL ANDA:', submit_withdraw: 'KIRIM PENARIKAN',
      invalid_addr: 'Alamat dompet tidak valid. Periksa dan coba lagi.',
      invalid_addr_usdt: 'Alamat USDT harus dimulai dengan T dan berupa alamat TRC20 34 karakter yang valid.',
      invalid_addr_btc: 'Alamat BTC harus dimulai dengan 1, 3 atau bc1, panjang 26-62 karakter.',
      invalid_addr_eth: 'Alamat ETH harus dimulai dengan 0x dan panjang 42 karakter.',
      invalid_addr_doge: 'Alamat DOGE harus dimulai dengan D dan panjang 34 karakter.',
      invalid_addr_trx: 'Alamat TRX harus dimulai dengan T dan panjang 34 karakter.',
      invalid_addr_sol: 'Alamat SOL harus Base58, 32-44 karakter.',
      confirm_kicker: 'NOTIFIKASI', confirm_title: 'PERMINTAAN PENARIKAN DIKIRIM', confirm_p1: 'Permintaan penarikan hadiah Anda berhasil dikirim!', confirm_p2: 'Kami akan mentransfer hadiah ini ke dompet Anda dalam {n} hari kerja. Harap pantau akun Anda.',
      view_records: '📋 Penarikan Saya', contact_support: 'Hubungi Dukungan', contact_to_get_reward: '💰 Hubungi dukungan untuk mendapatkan hadiah Anda',
      my_records_title: 'Riwayat Penarikan Saya', my_records_kicker: 'RIWAYAT PENARIKAN', close_btn: 'Tutup', loading: 'Memuat...', no_records: 'Tidak ada riwayat', load_failed: 'Gagal memuat', status_pending: '⏳ Menunggu', status_approved: '✅ Disetujui', status_rejected: '❌ Ditolak', label_addr: 'Alamat', label_amount: 'Jumlah', label_time: 'Waktu',
      limit_reached: 'Batas penarikan harian tercapai. Silakan kembali besok.',
      safari_alert_body: 'Agar game berjalan dengan baik, ketuk "OK" untuk menyalin tautan, lalu buka Safari dan tempel.', safari_alert_copied: 'Tautan disalin! Buka Safari dan tempel.', copy_fail_prompt: 'Gagal menyalin, silakan salin manual:'
    },
    ms: { howto_title: 'Cara Bermain · Penerangan', howto_p1: '<span class="highlight-cyan">Putar 5 gelendong</span> untuk memadankan simbol crypto. Anda mendapat <em>3 putaran percuma</em> untuk mula — tiada deposit!', howto_p2: 'Padankan <em>2+ simbol sama</em> pada payline tengah untuk menang. Menang sehingga <em>10,000</em> untuk 5 sama!', howto_p3: 'Selepas putaran, tuntut kemenangan ke baki, kemudian <span class="highlight-cyan">tarik ganjaran</span>.', banner_kicker: 'MENANG HINGGA', banner_amt: '10,000 USDT', banner_end: 'PERCUMA!', banner_sub: 'Putar 3 kali untuk membuka baki permulaan. <em>Tiada deposit diperlukan!</em>', spin_btn: 'PUTAR SEKARANG', spins_left: 'PUTARAN PERCUMA TINGGAL:', rolling_title: '⛓ PENGELUARAN TERKINI',
      spinning_btn: 'MEMUTAR...', extract_btn: 'TARIK GANJARAN', claim_btn: 'TUNTUT KE BAKI', claimed: 'DITERIMA',
      win_kicker_normal: 'BAYARAN NEON', win_kicker_jackpot: 'JACKPOT KUANTUM', win_title_normal: 'ANDA MENANG', win_title_jackpot: 'JACKPOT', win_desc: 'Padan {n} simbol {sym}! +{amt} {cur}',
      no_win_kicker: 'TIADA TUAH KALI INI', no_win_title: 'TIADA KEMENANGAN', no_win_desc: 'Kelima-lima simbol berbeza. Sila cuba lagi!', continue_btn: 'TERUSKAN',
      extract_kicker: 'PENGELUARAN', extract_title: 'TARIK', extract_label: 'MASUKKAN ALAMAT DOMPET ANDA:', extract_label_usdt: 'MASUKKAN ALAMAT USDT TRC20 ANDA:', extract_label_btc: 'MASUKKAN ALAMAT BTC ANDA:', extract_label_eth: 'MASUKKAN ALAMAT ETH ANDA:', extract_label_doge: 'MASUKKAN ALAMAT DOGE ANDA:', extract_label_trx: 'MASUKKAN ALAMAT TRX ANDA:', extract_label_sol: 'MASUKKAN ALAMAT SOL ANDA:', submit_withdraw: 'HANTAR PENGELUARAN',
      invalid_addr: 'Alamat dompet tidak sah. Sila semak dan cuba lagi.',
      invalid_addr_usdt: 'Alamat USDT mesti bermula dengan T dan merupakan alamat TRC20 34 aksara yang sah.',
      invalid_addr_btc: 'Alamat BTC mesti bermula dengan 1, 3 atau bc1, panjang 26-62 aksara.',
      invalid_addr_eth: 'Alamat ETH mesti bermula dengan 0x dan panjang 42 aksara.',
      invalid_addr_doge: 'Alamat DOGE mesti bermula dengan D dan panjang 34 aksara.',
      invalid_addr_trx: 'Alamat TRX mesti bermula dengan T dan panjang 34 aksara.',
      invalid_addr_sol: 'Alamat SOL mesti Base58, 32-44 aksara.',
      confirm_kicker: 'PEMBERITAHUAN', confirm_title: 'PERMINTAAN PENGELUARAN DIHANTAR', confirm_p1: 'Permintaan pengeluaran ganjaran anda berjaya dihantar!', confirm_p2: 'Kami akan memindahkan ganjaran ini ke dompet anda dalam {n} hari bekerja. Sila semak akaun anda.',
      view_records: '📋 Pengeluaran Saya', contact_support: 'Hubungi Sokongan', contact_to_get_reward: '💰 Hubungi sokongan untuk mendapatkan ganjaran anda',
      my_records_title: 'Rekod Pengeluaran Saya', my_records_kicker: 'REKOD PENGELUARAN', close_btn: 'Tutup', loading: 'Memuatkan...', no_records: 'Tiada rekod', load_failed: 'Gagal memuatkan', status_pending: '⏳ Menunggu', status_approved: '✅ Diluluskan', status_rejected: '❌ Ditolak', label_addr: 'Alamat', label_amount: 'Jumlah', label_time: 'Masa',
      limit_reached: 'Had pengeluaran harian dicapai. Sila kembali esok.',
      safari_alert_body: 'Supaya permainan berfungsi dengan baik, ketik "OK" untuk menyalin pautan, kemudian buka Safari dan tampal.', safari_alert_copied: 'Pautan disalin! Buka Safari dan tampal.', copy_fail_prompt: 'Gagal menyalin, sila salin secara manual:'
    },
    nl: { howto_title: 'Hoe te Spelen · Beschrijving', howto_p1: '<span class="highlight-cyan">Draai de 5 rollen</span> om crypto-symbolen te matchen. Je krijgt <em>3 gratis spins</em> om te starten — geen storting nodig!', howto_p2: 'Match <em>2+ identieke symbolen</em> op de middelste payline om te winnen. Win tot <em>10,000</em> voor 5 dezelfde!', howto_p3: 'Na je spins, claim winsten naar je saldo en <span class="highlight-cyan">extraheer beloningen</span>.', banner_kicker: 'WIN TOT', banner_amt: '10,000 USDT', banner_end: 'GRATIS!', banner_sub: 'Draai 3 keer om je startsaldo te ontgrendelen. <em>Geen storting nodig!</em>', spin_btn: 'NU DRAAIEN', spins_left: 'RESTERENDE GRATIS SPINS:', rolling_title: '⛓ RECENTE OPNAMES',
      spinning_btn: 'DRAAIT...', extract_btn: 'BELONINGEN EXTRAHEREN', claim_btn: 'CLAIM NAAR SALDO', claimed: 'GEÏNCASSEERD',
      win_kicker_normal: 'NEON UITBETALING', win_kicker_jackpot: 'QUANTUM JACKPOT', win_title_normal: 'JE WINT', win_title_jackpot: 'JACKPOT', win_desc: '{n} {sym} symbolen gematcht! +{amt} {cur}',
      no_win_kicker: 'DEZE KEER GEEN GELUK', no_win_title: 'GEEN WINST', no_win_desc: 'Alle 5 symbolen zijn verschillend. Probeer het opnieuw!', continue_btn: 'DOORGAAN',
      extract_kicker: 'OPNAME', extract_title: 'EXTRAHEREN', extract_label: 'VOER UW WALLET-ADRES IN:', extract_label_usdt: 'VOER UW USDT TRC20-ADRES IN:', extract_label_btc: 'VOER UW BTC-ADRES IN:', extract_label_eth: 'VOER UW ETH-ADRES IN:', extract_label_doge: 'VOER UW DOGE-ADRES IN:', extract_label_trx: 'VOER UW TRX-ADRES IN:', extract_label_sol: 'VOER UW SOL-ADRES IN:', submit_withdraw: 'OPNAME VERZENDEN',
      invalid_addr: 'Ongeldig wallet-adres. Controleer en probeer opnieuw.',
      invalid_addr_usdt: 'USDT-adres moet beginnen met T en een geldig 34-tekens TRC20-adres zijn.',
      invalid_addr_btc: 'BTC-adres moet beginnen met 1, 3 of bc1, en 26-62 tekens lang zijn.',
      invalid_addr_eth: 'ETH-adres moet beginnen met 0x en 42 tekens lang zijn.',
      invalid_addr_doge: 'DOGE-adres moet beginnen met D en 34 tekens lang zijn.',
      invalid_addr_trx: 'TRX-adres moet beginnen met T en 34 tekens lang zijn.',
      invalid_addr_sol: 'SOL-adres moet Base58 zijn, 32-44 tekens.',
      confirm_kicker: 'MELDING', confirm_title: 'OPNAMEVERZOEK VERZONDEN', confirm_p1: 'Uw verzoek tot opname van beloningen is succesvol verzonden!', confirm_p2: 'We zullen deze beloning binnen {n} werkdag naar uw wallet overmaken. Controleer uw account.',
      view_records: '📋 Mijn Opnames', contact_support: 'Contact Support', contact_to_get_reward: '💰 Neem contact op met support om je beloning te ontvangen',
      my_records_title: 'Mijn Opnamegeschiedenis', my_records_kicker: 'OPNAMEGESCHIEDENIS', close_btn: 'Sluiten', loading: 'Laden...', no_records: 'Geen opnames', load_failed: 'Laden mislukt', status_pending: '⏳ In behandeling', status_approved: '✅ Goedgekeurd', status_rejected: '❌ Afgewezen', label_addr: 'Adres', label_amount: 'Bedrag', label_time: 'Tijd',
      limit_reached: 'Dagelijkse opnamelimiet bereikt. Kom morgen terug.',
      safari_alert_body: 'Om het spel goed te laten werken, tikt u op "OK" om de link te kopiëren, opent u vervolgens Safari en plakt u deze.', safari_alert_copied: 'Link gekopieerd! Open Safari en plak.', copy_fail_prompt: 'Kopiëren mislukt, kopieer handmatig:'
    },
    pl: { howto_title: 'Jak Grać · Opis', howto_p1: '<span class="highlight-cyan">Obracaj 5 bębnów</span>, aby dopasować symbole krypto. Masz <em>3 darmowe obroty</em> na start — bez depozytu!', howto_p2: 'Dopasuj <em>2+ identyczne symbole</em> na środkowej linii wypłat, aby wygrać. Wygraj do <em>10,000</em> za 5 takich samych!', howto_p3: 'Po obrotach odbierz wygrane na saldo, następnie <span class="highlight-cyan">wypłać nagrody</span>.', banner_kicker: 'WYGRAJ DO', banner_amt: '10,000 USDT', banner_end: 'ZA DARMO!', banner_sub: 'Obracaj 3 razy, aby odblokować saldo startowe. <em>Bez depozytu!</em>', spin_btn: 'OBRACAJ TERAZ', spins_left: 'POZOSTAŁE DARMOWE OBROTY:', rolling_title: '⛓ OSTATNIE WYPŁATY',
      spinning_btn: 'OBRACANIE...', extract_btn: 'WYCOFAJ NAGRODY', claim_btn: 'ODBIERZ NA SALDO', claimed: 'ODEBRANE',
      win_kicker_normal: 'WYPŁATA NEON', win_kicker_jackpot: 'JACKPOT KWANTOWY', win_title_normal: 'WYGRAŁEŚ', win_title_jackpot: 'JACKPOT', win_desc: 'Dopasowano {n} symboli {sym}! +{amt} {cur}',
      no_win_kicker: 'TYM RAZEM BEZ SZCZĘŚCIA', no_win_title: 'BRAK WYGRANEJ', no_win_desc: 'Wszystkie 5 symboli są różne. Spróbuj ponownie!', continue_btn: 'KONTYNUUJ',
      extract_kicker: 'WYPŁATA', extract_title: 'WYCOFAJ', extract_label: 'WPROWADŹ ADRES SWOJEGO PORTFELA:', extract_label_usdt: 'WPROWADŹ SWÓJ ADRES USDT TRC20:', extract_label_btc: 'WPROWADŹ SWÓJ ADRES BTC:', extract_label_eth: 'WPROWADŹ SWÓJ ADRES ETH:', extract_label_doge: 'WPROWADŹ SWÓJ ADRES DOGE:', extract_label_trx: 'WPROWADŹ SWÓJ ADRES TRX:', extract_label_sol: 'WPROWADŹ SWÓJ ADRES SOL:', submit_withdraw: 'WYŚLIJ WYPŁATĘ',
      invalid_addr: 'Nieprawidłowy adres portfela. Sprawdź i spróbuj ponownie.',
      invalid_addr_usdt: 'Adres USDT musi zaczynać się od T i być prawidłowym 34-znakowym adresem TRC20.',
      invalid_addr_btc: 'Adres BTC musi zaczynać się od 1, 3 lub bc1 i mieć 26-62 znaków.',
      invalid_addr_eth: 'Adres ETH musi zaczynać się od 0x i mieć 42 znaki.',
      invalid_addr_doge: 'Adres DOGE musi zaczynać się od D i mieć 34 znaki.',
      invalid_addr_trx: 'Adres TRX musi zaczynać się od T i mieć 34 znaki.',
      invalid_addr_sol: 'Adres SOL musi być w Base58, 32-44 znaki.',
      confirm_kicker: 'POWIADOMIENIE', confirm_title: 'WNIOSEK O WYPŁATĘ WYSŁANY', confirm_p1: 'Twój wniosek o wypłatę nagrody został pomyślnie wysłany!', confirm_p2: 'Przelejemy tę nagrodę na Twoje konto w ciągu {n} dnia roboczego. Sprawdź swoje konto.',
      view_records: '📋 Moje Wypłaty', contact_support: 'Kontakt z Pomocą', contact_to_get_reward: '💰 Skontaktuj się z pomocą, aby otrzymać nagrodę',
      my_records_title: 'Moje Wypłaty', my_records_kicker: 'WYPŁATY', close_btn: 'Zamknij', loading: 'Ładowanie...', no_records: 'Brak wypłat', load_failed: 'Ładowanie nie powiodło się', status_pending: '⏳ Oczekuje', status_approved: '✅ Zatwierdzone', status_rejected: '❌ Odrzucone', label_addr: 'Adres', label_amount: 'Kwota', label_time: 'Czas',
      limit_reached: 'Osiągnięto dzienny limit wypłat. Wróć jutro.',
      safari_alert_body: 'Aby gra działała poprawnie, dotknij "OK", aby skopiować link, następnie otwórz Safari i wklej go.', safari_alert_copied: 'Link skopiowany! Otwórz Safari i wklej.', copy_fail_prompt: 'Kopiowanie nie powiodło się, skopiuj ręcznie:'
    }
  };

  const langSelect = document.getElementById('langSelect');
  let currentLang = 'en';

  function t(key){
    const trans = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    return (trans && trans[key]) || (TRANSLATIONS.en && TRANSLATIONS.en[key]) || key;
  }

  function getCur(){
    return (window.__GAME_CONFIG && window.__GAME_CONFIG.currency) || 'USDT';
  }

  window.__updateExtractLabel = function(){
    const cur = getCur();
    const key = 'extract_label_' + cur.toLowerCase();
    const el = document.getElementById('extractLabel');
    if (el) el.textContent = t(key) !== key ? t(key) : t('extract_label');
    const inp = document.getElementById('trc20Input');
    if (inp) {
      if (cur === 'ETH') inp.placeholder = '0x................................';
      else if (cur === 'BTC') inp.placeholder = '1... / 3... / bc1...';
      else if (cur === 'DOGE') inp.placeholder = 'D................................';
      else if (cur === 'SOL') inp.placeholder = '4................................';
      else inp.placeholder = 'T................................';
    }
  };

  function getAmountStr(){
    const cur = getCur();
    const r5 = (window.__GAME_CONFIG && window.__GAME_CONFIG.rewards && window.__GAME_CONFIG.rewards[5]) || 0;
    const fmt5 = (window.__formatAmount || (v => v))(r5, cur);
    return { fmt5, amtStr: fmt5 + ' ' + cur };
  }

  function updateModalTexts(trans) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    // 只在初始时设置，避免覆盖动态内容
    set('claimBtn', trans.claim_btn);
    set('extractKickerText', trans.extract_kicker);
    set('extractTitle', trans.extract_title);
    if (typeof window.__updateExtractLabel === 'function') window.__updateExtractLabel();
    set('submitWithdrawBtn', trans.submit_withdraw);
    set('confirmKicker', trans.confirm_kicker);
    set('confirmTitleText', trans.confirm_title);
    set('confirmP1', trans.confirm_p1);
    const p2 = document.getElementById('confirmP2');
    if (p2) p2.innerHTML = trans.confirm_p2.replace('{n}', '<strong>1</strong>');
    set('viewMyRecordsBtn', trans.view_records);
    set('modalContactBtn', trans.contact_support);
    set('myRecordsContactBtn', trans.contact_support);
    set('myRecordsKicker', trans.my_records_kicker);
    set('myRecordsTitle', trans.my_records_title);
    set('myRecordsCloseBtn', trans.close_btn);
    set('confirmContactTip', trans.contact_to_get_reward);
    set('myRecordsContactTip', trans.contact_to_get_reward);
  }

  function switchLanguage(code) {
    currentLang = code;
    const trans = TRANSLATIONS[code] || TRANSLATIONS.en;
    window.__currentLang = code;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const { fmt5, amtStr } = getAmountStr();

    set('howtoTitleText', trans.howto_title);
    const h1 = document.getElementById('howtoP1'); if (h1) h1.innerHTML = trans.howto_p1;
    const h2 = document.getElementById('howtoP2');
    if (h2) h2.innerHTML = trans.howto_p2.replace(/10,000\s+USDT/g, amtStr).replace(/10,000/g, fmt5);
    const h3 = document.getElementById('howtoP3'); if (h3) h3.innerHTML = trans.howto_p3;

    set('bannerKicker', trans.banner_kicker);
    const bannerAmtEl = document.getElementById('bannerAmt');
    if (bannerAmtEl) {
      bannerAmtEl.textContent = trans.banner_amt.replace(/10,000\s+USDT/g, amtStr).replace(/10,000/g, fmt5);
    }
    set('bannerEnd', trans.banner_end);
    const sub = document.getElementById('bannerSub'); if (sub) sub.innerHTML = trans.banner_sub;
    set('rollingTitleText', trans.rolling_title);

    if (typeof window.__refreshSpinBtn === 'function') {
      window.__refreshSpinBtn();
    } else {
      const spinBtn = document.getElementById('spinBtn');
      if (spinBtn && !spinBtn.classList.contains('is-extract')) {
        const isBusy = spinBtn.disabled && /\.\.\./.test(spinBtn.textContent);
        if (!isBusy) spinBtn.textContent = trans.spin_btn;
      }
    }

    const spinsLeftDiv = document.getElementById('spinsLeftDiv');
    if (spinsLeftDiv) {
      const strong = spinsLeftDiv.querySelector('strong');
      const strongVal = strong ? strong.textContent : '3';
      spinsLeftDiv.innerHTML = trans.spins_left + ' <strong id="spinsText">' + strongVal + '</strong>/3';
    }

    updateModalTexts(trans);

    const mrModal = document.getElementById('myRecordsModal');
    if (mrModal && mrModal.classList.contains('open') && window.__reloadMyRecords) {
      window.__reloadMyRecords();
    }
  }

  if (langSelect) {
    langSelect.addEventListener('change', function() { switchLanguage(this.value); });
    switchLanguage('en');
  }

  window.switchLanguage = switchLanguage;
  window.__t = t;
  window.__TRANSLATIONS = TRANSLATIONS;
})();
