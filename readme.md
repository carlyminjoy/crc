# Cancer Risk Calculator and Scorecard

This repository has two branches for this project:

-   `crc`: The Cancer Risk Calculator web app
-   `scorecard`: The scorecard application with detailed recommendations and resources. Must have a user url param with a hashed email to load a scorecard(s) and load.

## Scorecard

### Overview

This app is accessible to users who have completed the form on the Cancer Risk Calculator to receive their scorecard. It displays their total and category scores in detail, with information on their answers and guidelines for each individual question. It also displays relevant resources to their answers to help them reduce their cancer risk.

### Architecture

The scorecard application uses the `user` url parameter to grab all Cosmos entries for that email on load. It then displays the user's total and category scores, recommendations, and relevant resources for their latest answers.

The `App` component passes the user's most recent scorecard (and their second most recent, if applicable) to the `Scorecard` component. If there are both scorecards, it will compare the user's results.

The `Scorecard` component generates each category UI card by sorting each category question into "good" or "bad". All questions in the "bad" category will check the `src/config/tips.js` and `src/config/resources.js` file for matching question `id`s, and add these tips and resources to the scorecard.

### Endpoints

-   `https://prod-05.australiaeast.logic.azure.com/workflows/df753e6a563e451ea76a06b71d1a4a9e/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=pge8rl1wK4YG2jeyFkb3gl38yu97YZAyBzp6Dd6vAxA`

The one and only endpoint for this app retrieves all user's Cancer Risk Calculator entries from Cosmos DB via the Logic App `process-cancerriskscore-la`.
