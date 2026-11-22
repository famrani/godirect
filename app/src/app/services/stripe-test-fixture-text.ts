export const STRIPE_TEST_FIXTURE_TEXT:Record<string,Record<string,string>>={
  "en": {
    "create": "Create my Stripe test account",
    "explanation": "GoDirect supplies synthetic test identity and bank details. No real identity documents or bank account are needed.",
    "consent": "I agree to create a synthetic test account. If the current account is incomplete and unused, replace its connection.",
    "pending": "Stripe is checking the test account. Refresh the status; payments remain disabled until Stripe enables them.",
    "inUse": "This test account is already linked to bookings or payments. Create a new GoDirect test owner instead.",
    "disabled": "Test account creation is disabled on the server.",
    "failed": "Unable to create the test account. Check the server error and Stripe request logs."
  },
  "fr": {
    "create": "Créer mon compte Stripe de test",
    "explanation": "GoDirect fournit une identité et un compte bancaire fictifs de test. Aucun document d’identité ni compte bancaire réel n’est nécessaire.",
    "consent": "J’accepte de créer un compte fictif de test. Si le compte actuel est incomplet et inutilisé, remplacer sa connexion.",
    "pending": "Stripe vérifie le compte test. Actualisez le statut ; les paiements restent désactivés tant que Stripe ne les active pas.",
    "inUse": "Ce compte test est déjà lié à des réservations ou paiements. Créez un nouveau propriétaire test dans GoDirect.",
    "disabled": "La création de comptes test est désactivée sur le serveur.",
    "failed": "Impossible de créer le compte test. Vérifiez l’erreur serveur et les journaux des requêtes Stripe."
  },
  "es": {
    "create": "Crear mi cuenta Stripe de prueba",
    "explanation": "GoDirect proporciona identidad y datos bancarios ficticios. No se necesitan documentos ni cuentas bancarias reales.",
    "consent": "Acepto crear una cuenta ficticia de prueba y sustituir la conexión actual si está incompleta y sin uso.",
    "pending": "Stripe está verificando la cuenta. Actualice el estado; los pagos siguen desactivados hasta su activación por Stripe.",
    "inUse": "Esta cuenta ya está vinculada a reservas o pagos. Cree otro propietario de prueba en GoDirect.",
    "disabled": "La creación de cuentas de prueba está desactivada en el servidor.",
    "failed": "No se pudo crear la cuenta. Revise el error del servidor y los registros de Stripe."
  },
  "it": {
    "create": "Crea il mio conto Stripe di prova",
    "explanation": "GoDirect fornisce identità e dati bancari fittizi. Non servono documenti o conti bancari reali.",
    "consent": "Accetto di creare un conto fittizio e sostituire la connessione attuale se incompleta e inutilizzata.",
    "pending": "Stripe sta verificando il conto. Aggiorna lo stato; i pagamenti restano disattivati fino all’attivazione da parte di Stripe.",
    "inUse": "Il conto è già collegato a prenotazioni o pagamenti. Crea un nuovo proprietario di prova in GoDirect.",
    "disabled": "La creazione dei conti di prova è disattivata sul server.",
    "failed": "Impossibile creare il conto. Controlla l’errore del server e i registri Stripe."
  },
  "de": {
    "create": "Mein Stripe-Testkonto erstellen",
    "explanation": "GoDirect stellt fiktive Identitäts- und Bankdaten bereit. Echte Dokumente oder Bankkonten sind nicht erforderlich.",
    "consent": "Ich stimme der Erstellung eines fiktiven Testkontos zu. Eine unvollständige, ungenutzte Verbindung darf ersetzt werden.",
    "pending": "Stripe prüft das Testkonto. Status aktualisieren; Zahlungen bleiben bis zur Freigabe durch Stripe deaktiviert.",
    "inUse": "Dieses Konto ist bereits mit Buchungen oder Zahlungen verknüpft. Einen neuen Testvermieter in GoDirect erstellen.",
    "disabled": "Die Erstellung von Testkonten ist auf dem Server deaktiviert.",
    "failed": "Testkonto konnte nicht erstellt werden. Serverfehler und Stripe-Protokolle prüfen."
  },
  "nl": {
    "create": "Mijn Stripe-testaccount aanmaken",
    "explanation": "GoDirect verstrekt fictieve identiteits- en bankgegevens. Echte documenten of bankrekeningen zijn niet nodig.",
    "consent": "Ik ga akkoord met een fictief testaccount en vervanging van de huidige koppeling als deze onvolledig en ongebruikt is.",
    "pending": "Stripe controleert het testaccount. Vernieuw de status; betalingen blijven uitgeschakeld tot Stripe ze activeert.",
    "inUse": "Dit account is al gekoppeld aan boekingen of betalingen. Maak een nieuwe testeigenaar in GoDirect.",
    "disabled": "Het aanmaken van testaccounts is uitgeschakeld op de server.",
    "failed": "Het testaccount kon niet worden aangemaakt. Controleer de serverfout en Stripe-logboeken."
  },
  "ru": {
    "create": "Создать тестовый аккаунт Stripe",
    "explanation": "GoDirect предоставляет вымышленные личные и банковские данные. Настоящие документы и банковский счёт не нужны.",
    "consent": "Я согласен создать вымышленный тестовый аккаунт и заменить текущее подключение, если оно не завершено и не использовалось.",
    "pending": "Stripe проверяет аккаунт. Обновите статус; платежи недоступны, пока Stripe их не разрешит.",
    "inUse": "Аккаунт уже связан с бронированиями или платежами. Создайте нового тестового владельца в GoDirect.",
    "disabled": "Создание тестовых аккаунтов отключено на сервере.",
    "failed": "Не удалось создать аккаунт. Проверьте ошибку сервера и журналы Stripe."
  }
};
