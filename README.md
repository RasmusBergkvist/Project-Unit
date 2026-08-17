# Project Unit

Detta är ett projekt i kursen DT208G Programmering i TypeScript. Applikationen är skapad för ett fiktivt lärosäte med 4 328 kurser. Användaren kan lägga till och ta bort kurser i ett ramschema, samt se summering av antal högskolepoäng (HP) och kurser i ramschemat. Kurserna i ramschemat sparas till Local Storage. Det går även att filtrera på kurskod, kursnamn, ämne och nivå, samt sortera på kurskod, kursnamn, poäng och ämne. Kurslistan har en paginator där upp till 30 kurser visas i taget samt en laddningsanimation (spinner) vid hämtning av kurserna. Kurser som läggs till i ramschemat går även att se från startsidan (kurskod och kursnamn) med fragment-länk till kursens plats i ramschemat där mer information om kursen finns. Huvudmenyn ändras efter skärmens storlek. På desktop och surfplattor finns den i headern och på mobiler är den fixerad vid skärmens nedre del. Applikationen är även installerbar som en fritstående app (PWA).

## Funktionalitet
Projektet uppfyller samtliga grundläggande krav. Utöver detta har extra funktionalitet lagts till:

* Mer avancerat användargränssnitt med olika huvudmenyer. 
* Kurskort används istället för tabeller på sidorna kurser och ramschema.
* Kurser grupperas under sitt respektive ämnesområde till tillhörande rubrik på ramschemasidan.
* Antal kurser och ämnen läses dynamiskt ut på startsidan från kursfilen vilket gör att om filen ändras så uppdateras även detta.
* Sparade kurser visas på startsidan med ankarlänkar (fragment) till ramschemat.
* Möjlighet att filtrera kurser på nivåer.
* Sortering av kurser via en service som används både på kurssidan och ramschemasidan, utan att de påverkar varandra.
* Scroll-to-top-knapp.
* Paginator.
* Laddningsanimation.
* PWA.

## Url till webbplatsen

## Teknik
* Ramverk: Angular och Angular Material
* Programmeringspårk: TypeScript
* Styling: SCSS med variabler och mixins
* HTTP-client
* Signals med computed och effect
* Databinding 

## Interface
Applikationen använder ett interface med där datans värde defineras:

```
export interface Course {
    courseCode: string,
    subjectCode: string,
    level: string,
    progression: string,
    courseName: string,
    points: number,
    institutionCode: string,
    subject: string,
    syllabus: string 
}
```

## Service 
Applikationen använder 3 services: 

### CourseService
Hämtar kursdata från en JSON-fil med HttpClient genom metoden getCourses() och laddar sedan in datan i applikationen med metoden loadCourses().

### SchudeleService
Service för att ladda och spara ramschemat till Local Storage via en effect-signal. Den hanterar även möjligheten att lägga till och ta bort kurser samt att rensa hela ramschemat. En kontroll av dubbletter görs innan en kurs läggs till via metoden isCourseInSchedule(), och metoden toggleCourseStatus() växlar kursens status beroende på om den ska läggas till eller tas bort i ramschemat.

### SortService
Service för att hantera sortering och sorteringsordning av kurser baserat på kurskod, kursnamn, poäng och ämne. Metoden sortCourses() sorterar datan efter textsträngar och nummer samt sorterar kurserna i stigande och fallande ordning. Metoden changeSortOrder() växlar mellan stigande och fallande sorteringsriktning, samt byter sorteringsfält vid interaktion med en annan sorteringsknapp.

## Komponenter 
Applikationen består av 3 komponenter och 3 delkomponenter(partials). 

* **HomeComponent**: Applikationens startsidan bestående av en välkomsttext och routerLink till kurssidan, snabbfakta som via databindning läser ut antalet kurser och ämnen som lärosätet tillhandhåller, samt en överblick över de kurser i ramschemat visas om det finns sparat i Local Storage. Kurser är försedda med ankarlänkar ([fragament]) som leder användaren till rätt plats i schemat. Om inga kurser finns sparade används @empty för visa en annan text och länk till kurssidan.

* **CourseComponent**: Visar initialt kurslistan med samtliga kurser. En laddninganimation triggas under tiden kurserna laddas. Om kurs misslyckas laddas visas ett felmeddelande för användaren. En paginator finns längst ner på sidan där upp till 30 kurser visas i taget, byta sida och hoppa till första och sida sidan. Vid använding av pagnitorn scrollas användaren till sidans topp. Vid sortering och filtrering av kurserna återställs paginatorn till sidan 1 igen. Kurserna kan sorteras i stigande och fallande ordning. De visas även antalet av det total utbudet vid filteringen, samt ett @empty-meddelande om inget matchar sökordet eller filtering. 

* **ScheduleComponent**: Visar sparade kurser i Local Storage. Innan kursen renderas till gränssnittet kontrolleras vilket ämne som de tillhör och skapar en rubrik till ämnet. Därefter renderas kurserna ut under tillhörande ämnesrubrik. På sidan visas även antal poäng och kurser som via computed-signaler uppdateras när kurser läggs till eller tas bort i ramschemat. Om inga kurser finns sparade används @empty för att skriva ut ett meddelande till användaren samt en länk till kurssidan.

* **Main-nav(partial)**: Delkomponent för huvudmeny med länkning via RouterLink och RouterLinkActive för att visa den aktiva sidan. Via media queries ändras huvudmenyns utseende som fixeras den vid skärmens nedre del vid max-width på 768px, i stället för i headern som visar på större enheter.

* **Main-footer(partial)**: Delkomponent för layout och styling av applikationens footer. Då sociala medierna endast är fiktiva stoppas länkningen via klick-eventet $event.preventDefault().

* **Scroll-Button(partial)**: En delkomponent för en "scroll-to-top"-knapp. Komponenten lyssnar  på webbläsarens scrollposition och blir synlig först när användaren har scrollat mer än 600 px. Vid ett klick på knappenförs användaren mjukt tillbaka upp till sidans topp.

## PWA 
Webbapplikationen kan installeras som en fristående app via webbläsarfönstret.


