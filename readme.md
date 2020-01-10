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

### Architecture

All questions/comments are stored in `src/config/config.js` and are fed into the `src/components/Quiz` component. Any updates to the questions should be made through the `config.js` file without any other changes to the code, as long as the complexity does not exceed that of other questions.

Each question/comment object in the config file can have the following properties:

-   `id`: string
-   `question`: boolean (required)
-   `category`: string
-   `text`: string (required)
-   `score`: float|null
-   `scoredQuestion`: boolean
-   `display`: method (required)
-   `userResponded`: boolean
-   `options`: object[]

`id`
A string that identifies the question. Used in score calculation, recommending resources, and reporting.

`question`
Whether the block of text is a question or a comment. If a question, it awaits user interaction. Otherwise a timer is set to display the next question/comment.

`category`
The question category. Used to group questions into their categories for score calculations.

`text`
HTML that renders on the page for this question/comment. Appears within the grey speech bubble, on the left.

`score`
The user's score for this question, after they have selected an answer.

`scoredQuestion`
Whether this question should be included in score calculations.

`display`
A method that returns a boolean value to determine if this question/comment should be displayed. Sometimes conditional, based on user's previous answers (e.g. selecting 'male' for gender means that the breast screening question will not display).

`userResponded`
Whether the user has answered the question yet. Triggers the next question/comment to display, and displays the user response.

`options`
An array of response objects that render to the screen as radio options.

-   `label`: The text that appears on the radio input
-   `score`: The score associated with this option, binds to the parent `score` property if selected
-   `userResponse`: Text that will render as the user response (displayed in the blue speech bubble, on the right) if this option is selected

### Endpoints

-   `/formsubmit`
-   `https://prod-16.australiaeast.logic.azure.com/workflows/472070d88d9f4f4899e2c2ad200967d0/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=caau2HrVCDbyNa256L0-a38ko8Q3r-rMJnkaPWxTOng` (all submissions)

The first endpoint is hit when a user completes the form with their details, sending over their detailed answers, scores and recommendations to Cosmos DB through the `form-submit` proxy. Once their Cosmos entry is in the event grid, the Logic App `process-cancerriskquiz-la` is triggered, adding the Cosmos ID to table storage tied to their hashed email so future submissions can be tied back to the same user.

The second endpoint is hit everytime a user completes the questionnaire, regardless of whether they enter their details or not. Their details are anonymously sent to table storage `ccqformstorage` > `cancerriskquiz` for analysis in BI. This endpoint goes through the Logic App `process-allquizresults-la`.
