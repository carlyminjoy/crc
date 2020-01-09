# Cancer Risk Calculator and Scorecard

This repository has two branches for this project:

-   `crc`: The Cancer Risk Calculator web app
-   `scorecard` : The scorecard application with detailed recommendations and resources. Must have a `user` url param with a hashed email to load a scorecard(s) and load.

## Cancer Risk Calculator

### Overview

The Cancer Risk Calculator app does not calculate a user's cancer risk, as the name would suggest. Instead, it asks a series of questions and calculates a total score out of 100, reflecting how much a user is reducing their cancer risk (the higher the score, the more the user is reducing their cancer risk).

Scored categories include:

-   Alcohol
-   Physical Activity
-   Screening
-   UV
-   Smoking
-   Nutrition
-   Weight

Users must answer at least one question within a category for it to be scored and included in their total score.

All questions are stored in `src/config/config.js` and are fed into the `src/components/Quiz` component. Any updates to the questions should be made through the `config.js` file without any other changes to the code, as long as the complexity does not exceed that of other questions.

### Endpoints

-   `/formsubmit`
-   `https://prod-16.australiaeast.logic.azure.com/workflows/472070d88d9f4f4899e2c2ad200967d0/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=caau2HrVCDbyNa256L0-a38ko8Q3r-rMJnkaPWxTOng` (all submissions)

The first endpoint is hit when a user completes the form with their details, sending over their detailed answers, scores and recommendations to Cosmos DB through the `form-submit` proxy. The scorecard application grabs all Cosmos entries for each email for display and comparison.

The second endpoint is hit everytime a user completes the questionnaire, regardless of whether they enter their details or not. Their details are anonymously sent to table storage `ccqformstorage` > `cancerriskquiz` for analysis in BI.
