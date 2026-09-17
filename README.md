# Systemutveckling, Grupprojekt 1 - Grupp 4

## Links
Github: https://github.com/shemaakamal00/group4
Trello: https://trello.com/b/eTgY8Ev1/gruppuppgift-1-sysutv

## Projektmedlemmar
- Nikolaos Kiosses
- Sheema Kamal
- Harald Wallin 

## Description
Vi bygger ett verktyg för att strukturera och hålla koll på jobbansökningar.

Användaren ska kunna skapa och hantera jobbansökningar, sätta mål och följa
sin aktivitet. Applikationen kommer även att innehålla olika medlemsnivåer
som ger tillgång till utökad funktionalitet och innehåll. 

## TechStack

Versionhantering
- Github

Frontend
- Vite
- React
- TypeScript
- CSS

Backend
- Node.js
- Express
- TypeScript
- SupaBase

Deploy
- Vercel
- Render

Test
- Postman Endpoint
- ESLint (syntax)

## Kom igång

Klona projektet:

bash
- git clone https://github.com/shemaakamal00/group4.git
- cd group4

### Frontend
- cd client
- npm install
- npm run dev

### Backend

- cd server
- npm install


## Projektstruktur

### Pages
- HomePage/Landningssida: "Välkommen - logga in eller sign-up" 
- ApplicationsPage/”Ansökningar” : Visar och hanterar användarens ansökningar
- GoalsPage/”Mål” : Visar och hanterar användarens mål
- ArticlesPage: En sida som exponerar articleCards för users och där admin kan skapa articles.
- ArticlePage: Sidan som visar en specifik article.
- DashboardPage/Översikt: Sida som innehåller statistik och dashboard

(gammal text nedan)
Förslag
- ArticlesPage: En sida där betygskriteriet ”- En administratör ska kunna lägga till innehållssidor och välja vilken nivå man måste ha för att få se den ” kan uppfyllas. Admin kan skapa en Article, egentligen endast med Rubrik, beskrivning, brödtext och vilken plan man måste få ha för att få läsa den. I verkligheten kanske arikeln innehållit t.ex en video om retorik-tips eller dylikt, lite mer ”preimium-content”. Varje ArticleCard öppnas som en ny page.
-ArticlePage: Varje artikel får egen url (/articles/:id).

### Modals
- AuthModal: Login/Register
- ApplicationModal: create/view/edit ett applicationCard
- GoalModal: create/view/edit ett goal
- ProfileModal: Visar användarens egna info (kan redigeras?), plan, och kvitton. 
- UpgradeModal: En vy där alla perks med att uppgradera listas, + betalning
- AdminSettingsModal: En överblick över t.ex hur många applications varje payment plan får ha,  och vilka features som är tillgängliga.
- ArticleModal: create/view/edit en Article.

### Components
- ApplicationCard
- ApplicationList
- ApplicationForm
- ApplicationStatusIcon

- GoalCard
- GoalList
- ReceiptCard
- ReceiptList

- Modal(Generell modal-prefab)
- Loader/spinner

- ArticleCard
- ArticleList
- ArticleForm (titel, beskrivning, brödtext, required plan)