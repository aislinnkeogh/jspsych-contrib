var jsPsychPluginSentenceCompletion = (function (jspsych) {
  "use strict";

  const info = {
    name: "plugin-sentence-completion",
    version: "0.0.1", // When working in a Javascript environment with no build, you will need to manually put set the version information. This is used for metadata purposes and publishing.
    parameters: {
      /** The sentence for the participant to complete. Each #w will be replaced with one gap to be filled. Whitespace in the displayed sentence is determined by whitespace in the provided string e.g. #w#w will display two adjacent gaps (i.e. syllables/morphemes within a word), while #w #w will display two gaps separated by whitespace (i.e. separate words). */
      sentence: {
        type: jspsych.ParameterType.STRING,
        default: undefined,
      },
      /** Labels for the buttons. Each different string in the array will generate a different button in the wordbank. */
      choices: {
        type: ParameterType.STRING,
        default: undefined,
        array: true
      },
      /** An HTML string to be displayed if the participant is completing the sentence based on some stimulus (e.g. an image that they need to describe). */
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null,
      },
      /** If true, then the buttons in the wordbank will be randomly shuffled. */
      randomize_order: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      /** If true, then the participant can click the same button to fill multiple gaps in the sentence. */
      allow_duplicates: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      /** Text to display if allow_duplicates is false and the participant attempts to click a button that has already been clicked again. */
      duplicates_warning: {
        type: jspsych.ParameterType.STRING,
        default: "You cannot click the same button more than once."
      },
      /** If true, then the participant will be required to click every button in the wordbank at least once before they can submit the sentence. */
      use_all_buttons: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      /** Text to display if use_all_buttons is true and the participant attempts to submit the sentence without clicking all buttons at least once. */
      all_buttons_warning: {
        type: jspsych.ParameterType.STRING,
        default: "You must click every button at least once."
      },
      /** Label to display on the button underneath the wordbank allowing the participant to clear the most recently filled gap. */
      undo_button_label: {
        type: jspsych.ParameterType.STRING,
        default: "UNDO"
      },
      /** Label to display on the button underneath the wordbank allowing the participant to submit their completed sentence. */
      submit_button_label: {
        type: jspsych.ParameterType.STRING,
        default: "SUBMIT"
      },
      /** A function that generates the HTML for each button in the `choices` array. The function gets the string and index of the item in the `choices` array and should return valid HTML. If you want to use different markup for each button, you can do that by using a conditional on either parameter. The default parameter returns a button element with the text label of the choice. */
      button_html: {
        type: jspsych.ParameterType.FUNCTION,
        default: function (choice) {
          return `<button class="jspsych-btn">${choice}</button>`;
        },
      },
      /** This string can contain HTML markup. Any content here will be displayed below the stimulus. The intention is that it can be used to provide a reminder about the action the participant is supposed to take. */
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null,
      },
      /** How long to display the stimulus, in milliseconds. The visibility CSS property of the stimulus will be set to `hidden` after this time has elapsed. If this is null, then the stimulus will remain visible until the trial ends. */
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        default: null,
      },
      /** How long to wait for the participant to make a response before ending the trial, in milliseconds. If the participant fails to make a response before this timer is reached, the participant's response will be recorded as null for the trial and the trial will end. If the value of this parameter is null, the trial will wait for a response indefinitely. */
      trial_duration: {
        type: jspsych.ParameterType.INT,
        default: null,
      },
      /** Setting to `'grid'` will make the container element have the CSS property `display: grid` and enable the use of `grid_rows` and `grid_columns`. Setting to `'flex'` will make the container element have the CSS property `display: flex`. You can customize how the buttons are laid out by adding inline CSS in the `button_html` parameter. */
      button_layout: {
        type: jspsych.ParameterType.STRING,
        default: "grid",
      },
      /** The number of rows in the button grid. Only applicable when `button_layout` is set to `'grid'`. If null, the number of rows will be determined automatically based on the number of buttons and the number of columns. */
      grid_rows: {
        type: jspsych.ParameterType.INT,
        default: 1,
      },
      /** The number of columns in the button grid. Only applicable when `button_layout` is set to `'grid'`. If null, the number of columns will be determined automatically based on the number of buttons and the number of rows. */
      grid_columns: {
        type: ParameterType.INT,
        default: null,
      },
    },
    data: {
      /** Reaction time */
      rt: {
        type: ParameterType.INT,
      },
      /** The starting sentence presented to participants **/
      sentence: {
        type: ParameterType.STRING,
      },
      /** The final sentence the participant submitted. */
      response: {
        type: ParameterType.STRING,
      },
      // When working in a Javascript environment with no build, you will need to manually put the citations information.
      // You may find it useful to fill in the CITATION.cff file generated with this package and use this script to generate your citations:
      // https://github.com/jspsych/jsPsych/blob/main/packages/config/generateCitations.js
      // This is helpful for users of your plugin to easily cite it.
      citations: '__CITATIONS__', // prettier-ignore
    },
  };

  /**
   * **plugin-sentence-completion**
   *
   * Shows the participant a sentence containing some gaps, and a bank of buttons. Each button click fills in one gap.
   *
   * @author Aislinn Keogh, Christian Mott and Bran Papineau
   * @see {@link /plugin-sentence-completion/README.md}
   */
  class SentenceCompletionPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {

      //
      let html = `<div class="container" id="textContainer">
                  </div>
                  <br><br>
                  <div class="container" id="wordContainer">
                  </div>
                  <br><br>
                  <div class="container" id="undoContainer">
                  </div>`;
      display_element.innerHTML = html;

      // data saving
      var trial_data = {
        data1: 99, // Make sure this type and name matches the information for data1 in the data object contained within the info const.
        data2: "hello world!", // Make sure this type and name matches the information for data2 in the data object contained within the info const.
      };
      // end trial
      this.jsPsych.finishTrial(trial_data);
    }
  }
  SentenceCompletionPlugin.info = info;

  return SentenceCompletionPlugin;
})(jsPsychModule);
