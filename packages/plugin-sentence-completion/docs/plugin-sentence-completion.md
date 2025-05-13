# plugin-sentence-completion

Shows the participant a sentence containing some gaps, and a bank of buttons. Each button click fills in one gap.

## Parameters

In addition to the [parameters available in all plugins](https://www.jspsych.org/latest/overview/plugins#parameters-available-in-all-plugins), this plugin accepts the following parameters. Parameters with a default value of undefined must be specified. Other parameters can be left unspecified if the default value is acceptable.

| Parameter           | Type             | Default Value      | Description                              |
| ------------------- | ---------------- | ------------------ | ---------------------------------------- |
| sentence            | string           | undefined          | The sentence for the participant to complete. Each #w will be replaced with one gap to be filled. Whitespace in the displayed sentence is determined by whitespace in the provided string e.g. #w#w will display two adjacent gaps (i.e. syllables/morphemes within a word), while #w #w will display two gaps separated by whitespace (i.e. separate words). |
| choices             | array of strings | undefined          | Labels for the buttons. Each different string in the array will generate a different button in the wordbank. |
| stimulus            | HTML string      | null               | An HTML string to be displayed if the participant is completing the sentence based on some stimulus (e.g. an image that they need to describe). |
| randomize_order     | boolean          | true               | If true, then the buttons in the wordbank will be randomly shuffled. |
| allow_duplicates    | boolean          | true               | If true, then the participant can click the same button to fill multiple gaps in the sentence. |
| duplicates_warning  | string           | 'You cannot click the same button more than once.' | Text to display if `allow_duplicates` is false and the participant attempts to click a button that has already been clicked again. |
| use_all_buttons     | boolean          | false              | If true, then the participant will be required to click every button in the wordbank at least once before they can submit the sentence. |
| all_buttons_warning | string           | 'You must click every button at least once.' | Text to display if use_all_buttons is true and the participant attempts to submit the sentence without clicking all buttons at least once. |
| undo_button_label   | string           | 'UNDO'             | Label to display on the button underneath the wordbank allowing the participant to clear the most recently filled gap.
| submit_button_label | string           | 'SUBMIT'           | Label to display on the button underneath the wordbank allowing the participant to submit their completed sentence. |
| button_html         | function         | `(choice)=>'<button class="jspsych-btn">${choice}</button>';` | A function that generates the HTML for each button in the `choices` array. The function gets the string and index of the item in the `choices` array and should return valid HTML. If you want to use different markup for each button, you can do that by using a conditional on either parameter. The default parameter returns a button element with the text label of the choice. |
| prompt              | HTML string      | null               | This string can contain HTML markup. Any content here will be displayed below the stimulus. The intention is that it can be used to provide a reminder about the action the participant is supposed to take. |
| stimulus_duration   | numeric          | null               | How long to display the stimulus, in milliseconds. The visibility CSS property of the stimulus will be set to `hidden` after this time has elapsed. If this is null, then the stimulus will remain visible until the trial ends. |
| trial_duration      | numeric          | null               | How long to wait for the participant to make a response before ending the trial, in milliseconds. If the participant fails to make a response before this timer is reached, the participant's response will be recorded as null for the trial and the trial will end. If the value of this parameter is null, the trial will wait for a response indefinitely. |
| button_layout       | string           | 'grid'             | Setting to `'grid'` will make the container element have the CSS property `display: grid` and enable the use of `grid_rows` and `grid_columns`. Setting to `'flex'` will make the container element have the CSS property `display: flex`. You can customize how the buttons are laid out by adding inline CSS in the `button_html` parameter. |
| grid_rows           | numeric          | 1                  | The number of rows in the button grid. Only applicable when `button_layout` is set to `'grid'`. If null, the number of rows will be determined automatically based on the number of buttons and the number of columns. |
| grid_columns        | numeric          | null               | The number of columns in the button grid. Only applicable when `button_layout` is set to `'grid'`. If null, the number of columns will be determined automatically based on the number of buttons and the number of rows.

## Data Generated

In addition to the [default data collected by all plugins](https://www.jspsych.org/latest/overview/plugins#data-collected-by-all-plugins), this plugin collects the following data for each trial.

| Name      | Type    | Value                                    |
| --------- | ------- | ---------------------------------------- |
| rt        | numeric | The response time in milliseconds for the participant to make a response. The time is measured from when the stimulus first appears on the screen until the participant's response. |
| sentence  | string  | The starting sentence presented to the participant. |
| response  | string  | The final sentence the participant submitted. |

## Install

*Enter instructions for installing the plugin package here.*

## Examples

### Title of Example

```javascript
var trial = {
  type: jsPsychPluginSentenceCompletion
}
```
