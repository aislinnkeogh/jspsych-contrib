var jsPsychPluginSentenceConstruction = (function (jspsych) {
  "use strict";

  const info = {
    name: "plugin-sentence-construction",
    version: "0.0.1",
    parameters: {
      /** The sentence for the participant to complete. Each #w will be replaced with one gap to be filled. Whitespace in the displayed sentence is determined by whitespace in the provided string e.g. #w#w will display two adjacent gaps (i.e. syllables/morphemes within a word), while #w #w will display two gaps separated by whitespace (i.e. separate words). */
      sentence: {
        type: jspsych.ParameterType.STRING,
        default: null,
      },
      /** Labels for the buttons. Each different string in the array will generate a different button in the wordbank. */
      choices: {
        type: jspsych.ParameterType.STRING,
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
      /** Label to display on the button underneath the wordbank allowing the participant to clear the most recently filled gap. This string can contain HTML markup. */
      undo_button_label: {
        type: jspsych.ParameterType.HTML_STRING,
        default: "UNDO"
      },
      /** Label to display on the button underneath the wordbank allowing the participant to submit their completed sentence. This string can contain HTML markup. */
      submit_button_label: {
        type: jspsych.ParameterType.HTML_STRING,
        default: "SUBMIT"
      },
      /** If true, then the Submit button will be disabled until the participant has filled all gaps in the sentence. If false, the participant is able to submit their sentence at any point. */
      disable_submit_before_completion: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      /** If true, then the buttons in the wordbank will be disabled once the participant has filled all gaps in the sentence. If false, the participant is still able to click buttons in the wordbank after filling all gaps (although nothing will happen when they do so). */
      disable_wordbank_after_completion: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      /** A function that generates the HTML for each button in the `choices` array. The function gets the string and index of the item in the `choices` array and should return valid HTML. If you want to use different markup for each button, you can do that by using a conditional on either parameter. The default parameter returns a button element with the text label of the choice. */
      button_html: {
        type: jspsych.ParameterType.FUNCTION,
        default: function (choice, choiceIndex) {
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
      /** The maximum width of the text on the screen **/
      max_width: {
        type: jspsych.ParameterType.INT,
        default: 600,
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
        type: jspsych.ParameterType.INT,
        default: null,
      },
      /** The number of spaces between words in the fill-in-the-blank sentence. */
      spaces_between_words: {
        type: jspsych.ParameterType.INT,
        default: 6,
      },
      /** If true, then the sentence will be constructed on-screen from right-to-left (useful for RTL scripts like Arabic or Hebrew). */
      right_to_left: {
        type: jspsych.ParameterType.BOOL,
        default: false,
      },
    },
    data: {
      /** The response time in milliseconds for the participant to make a response. The time is measured from when the stimulus first appears on the screen until the participant's response. */
      rt: {
        type: jspsych.ParameterType.INT,
      },
      /** The starting sentence presented to the participant. **/
      sentence: {
        type: jspsych.ParameterType.STRING,
      },
      /** The final sentence the participant submitted. */
      response: {
        type: jspsych.ParameterType.STRING,
      },
      citations: '__CITATIONS__',
    },
  };

  /**
   * **plugin-sentence-construction**
   *
   * This plugin provides a bank of buttons, and allows the participant to build a sentence piece-by-piece on-screen by clicking those buttons. 
   * They can either build the sentence from scratch, or the experimenter can provide a sentence frame to the `sentence` parameter (with gaps to-be-filled indicated by `#w`). 
   * Each button click adds one element to the sentence. 
   * Elements can be whole words or smaller pieces (syllables or morphemes).
   *
   * @author Aislinn Keogh, Christian Mott and Bran Papineau
   * @see {@link /plugin-sentence-construction/README.md}
   */
  class SentenceConstructionPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {

      // Set spaces between words
      let wordSpaces = trial.spaces_between_words;
      // Record start time and declare rt
      let start_time = performance.now();
      let rt;

      // Randomize choice order if options selected
      if (trial.randomize_order) {
        trial.choices = jsPsych.randomization.repeat(trial.choices, 1);
      }

      // Create array of sentences (will append for quick undo)
      let sentences = [];
      let sentence1;

      // Reverse words in sentence if right_to_left is true
      if (trial.right_to_left && trial.sentence !== null) {
        sentence1 = trial.sentence.replaceAll('\.', ' #p');
        sentence1 = sentence1.split(' ').reverse().join(' ');
        sentence1 = sentence1.replaceAll('#p ', '\.');
      } else {
        sentence1 = trial.sentence;
      }

      // Add line breaks to sentence based on length
      if (trial.sentence !== null) {
        sentences.push(addBreaks(sentence1));
      } else {
        sentences.push('');
      }
 
      // Count gaps in sentence (for end-of-trial checks)
      let n_gaps = 0;
      if (trial.sentence != null) {
        n_gaps = trial.sentence.split("#w").length - 1;
      }
      
      // Initialize array of choices used (for end-of-trial checks)
      let choices_used_obj = {};
      let choices_used = Object.values(choices_used_obj);
      
      // Create html element for stimulus
      const stimulusElement = document.createElement("div");
      stimulusElement.id = "jspsych-html-button-response-stimulus";
      stimulusElement.innerHTML = trial.stimulus;
      display_element.appendChild(stimulusElement);

      // Create html element for text
      const textElement = document.createElement("div");
      textElement.id = "textContainer";
      //textElement.style.width = trial.max_width + "px";
      textElement.style.overflowWrap = "normal";
      textElement.style.whiteSpace = "normal";
      // Setting the direction this way was causing the errors
      // replaced with code at beginning flipping the sentence
      // if (trial.right_to_left) {
        //textElement.style.direction = "rtl";
      //}

      display_element.appendChild(textElement);
      
      // Generate the starting text
      if (trial.sentence == null) {
        displayUnderline();
      } else {
        addText(sentences[0]);
      }

      // Create word buttons
      const buttonGroupElement = document.createElement("div");
      buttonGroupElement.id = "jspsych-html-button-response-btngroup";
      if (trial.button_layout === "grid") {
        buttonGroupElement.classList.add("jspsych-btn-group-grid");
        if (trial.grid_rows === null && trial.grid_columns === null) {
          throw new Error(
            "You cannot set `grid_rows` to `null` without providing a value for `grid_columns`."
          );
        }
        const n_cols =
          trial.grid_columns === null
            ? Math.ceil(trial.choices.length / trial.grid_rows)
            : trial.grid_columns;
        const n_rows =
          trial.grid_rows === null
            ? Math.ceil(trial.choices.length / trial.grid_columns)
            : trial.grid_rows;
        buttonGroupElement.style.gridTemplateColumns = `repeat(${n_cols}, 1fr)`;
        buttonGroupElement.style.gridTemplateRows = `repeat(${n_rows}, 1fr)`;
      } else if (trial.button_layout === "flex") {
        buttonGroupElement.classList.add("jspsych-btn-group-flex");
      }

      for (const [choiceIndex, choice] of trial.choices.entries()) {
        buttonGroupElement.insertAdjacentHTML("beforeend", trial.button_html(choice, choiceIndex));
        const buttonElement = buttonGroupElement.lastChild;
        buttonElement.dataset.choice = choiceIndex.toString();
        buttonElement.addEventListener("click", () => {
          let index = Object.keys(choices_used_obj).length + 1;
          choices_used_obj[choiceIndex] = [choice, index];
          choices_used = Object.values(choices_used_obj).map((x) => x[0]);
          wordClicked(choice);
          updateButtonHTML();
        });
      }

      display_element.appendChild(buttonGroupElement);

      // Create undo and submit buttons
      const fnElement = document.createElement("div");
      fnElement.id = "fnContainer";

      const undo = document.createElement('button');
      undo.id = 'undo';
      undo.setAttribute(`class`, `jspsych-btn`);
      undo.textContent = trial.undo_button_label;
      fnElement.appendChild(undo);
            
      undo.onclick = function() {
        undoClicked();
      };

      const submit = document.createElement('button');
      submit.id = 'submit';
      submit.setAttribute(`class`, `jspsych-btn`);
      submit.textContent = trial.submit_button_label;
      
      
      // Disable submit button if not all gaps filled and there is a sentence frame
      if (trial.disable_submit_before_completion && !(choices_used.length == n_gaps) && trial.sentence != null) {
        submit.setAttribute("disabled", "disabled");
      }
      fnElement.appendChild(submit);
            
      submit.onclick = function() {
        submitClicked();
      };

      display_element.appendChild(fnElement);

      // Create prompt element if provided
      if (trial.prompt !== null) {
        display_element.insertAdjacentHTML("beforeend", `<div id="jspsych-html-button-response-prompt">${trial.prompt}</div><br><br>`);
      }

      // Remove Stimulus after stimulus_duration
      if (trial.stimulus_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(function () {
          stimulusElement.style.visibility = "hidden";
        }, trial.stimulus_duration);
      }

      // Remove trial after trial_duration
      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(function () {
          end_trial();
        }, trial.trial_duration);
      }

      // End of trial function
      const end_trial = () => {
        // measure rt
        let end_time = performance.now();
        rt = Math.round(end_time - start_time);
        // gather the data to store for the trial
        var trial_data = {
          rt: rt,
          sentence: trial.sentence,
          response: sentences[sentences.length - 1],
        };

        // move on to the next trial
        this.jsPsych.finishTrial(trial_data);
      };

      // Functions
      function undoClicked() {
        if (sentences.length > 1) {
          sentences.pop();
          addText(sentences[sentences.length-1]);
          let del = Object.keys(choices_used_obj).filter((x) => choices_used_obj[x][1] == choices_used.length);
          delete choices_used_obj[del[0]];
          choices_used = Object.values(choices_used_obj).map((x) => x[0]);
        } 
        if ((choices_used.length === 0) && (trial.sentence === null)) {
            displayUnderline();
        }
        updateButtonHTML();
      }

      // Function that handles submit button
      function submitClicked() {
        // Check whether all gaps have been filled
        let all_gaps_filled = true;
        if (trial.sentence != null) {
          all_gaps_filled = choices_used.length == n_gaps;
        }

        // If use_all_buttons is true, check if all buttons have indeed been used
        let buttons_used = true;
        if (trial.use_all_buttons) {
          buttons_used = trial.choices.sort().join(",")==choices_used.sort().join(",")
        }
        
        // If all gaps are filled and all buttons have been used, end the trial
        if (all_gaps_filled && buttons_used) {
          end_trial();
        } else {
          // Show appropriate warning message
          if (!all_gaps_filled) {
            alert("Please fill all gaps in the sentence before submitting.");
          } else {
            alert(trial.all_buttons_warning);
          }
        }
      }
      
      // Function that handles word clicks
      function wordClicked(word) {    
          updateText(sentences, word);
          addText(sentences[sentences.length-1]);
      }

      // Function that generates the underline for when there is no sentence frame
      function displayUnderline() {
        let text = document.getElementById('textContainer');
        text.innerHTML = '___________';
      }

      // Function that updates button group 
      function updateButtonHTML() {
        // Check whether the Submit button needs to be enabled/disabled
        if (trial.disable_submit_before_completion && trial.sentence!==null) {
          document.getElementById("submit").disabled = !(choices_used.length == n_gaps);
        }

        // Check whether the wordbank buttons need to be enabled/disabled
        let shouldDisableAll = false;
        if (trial.disable_wordbank_after_completion) {
          let buttons = buttonGroupElement.children;
          if (trial.sentence !== null) {
            shouldDisableAll = choices_used.length == n_gaps;
          }
          
          for (let button of buttons) {
            if (shouldDisableAll) {
              button.setAttribute("disabled", "disabled");
            } else {
              button.removeAttribute("disabled");
            }
          }
        }

        // If the researcher has selected to disable buttons after clicking, then disable the buttons that have been used
        if (!trial.allow_duplicates) {
          let buttons = buttonGroupElement.children;

          for (let button of buttons) {
            let disable = choices_used.includes(button.innerHTML) && Object.keys(choices_used_obj).includes(button.dataset.choice);
            if (disable) {
                button.setAttribute("disabled", "disabled");
            } else {
              if (!shouldDisableAll) {
                button.removeAttribute("disabled");
              }
            }

          }
        }

      }

      // Function that replaces spaces in the sentence with the correct number of spaces (if a frame is provided)
      function addText(sentence) {
        let text = document.getElementById('textContainer');
        text.innerHTML = '';

        let ftext;
        if (sentence == null) {
          ftext = sentence;
        } else {
          ftext = replaceSpaces(sentence, wordSpaces);
          ftext = ftext.replaceAll("#w#w", "____&nbsp;____");
          ftext = ftext.replaceAll("#w", "____");
          ftext = ftext.replaceAll("#b", "<br>");
        }
        text.innerHTML += ftext;
      }

      // Function that updates the sentence with the new word
      function updateText(sentences, word) {
        let sentence = sentences[sentences.length-1];
        let newSentence;
        let nospace = false;
    
        // Handle hyphen at start of word
        if (word.startsWith("-")) {
            word = word.replace(`-`, ``);
            nospace = true;
        }
        
        // Update and replace sentence
        if (trial.sentence == null) {
            nospace = sentence.length === 0 || nospace;
            if (trial.right_to_left) {
                // For RTL, add new words to the beginning instead of the end
                newSentence =  word + (nospace ? '' : ' ') + sentence;
            } else {
                // Original LTR behavior
                newSentence = sentence + (nospace ? '' : ' ') + word;
            }
            sentences.push(newSentence);
        } else {
            // For structured sentences with gaps marked by #w
            if (trial.right_to_left) {
              let windices = [...sentence.matchAll(new RegExp('#w', 'gi'))].map(a => a.index);
              let rindex = windices.pop();
              newSentence = sentence.substring(0, rindex) + word + sentence.substring(rindex+2);
              console.log(windices, rindex, newSentence);
            } else {
              newSentence = sentence.replace("#w", word);
            }
            sentences.push(newSentence);
        }
    }

      function replaceSpaces(str, numSpaces) {
          let halfSpaces = Math.floor(numSpaces/2);
          let spaces;
          if (numSpaces % 2 == 1) {
            spaces = '&nbsp;'.repeat(halfSpaces) + ' ' + '&nbsp;'.repeat(halfSpaces);
          } else {
            spaces = '&nbsp;'.repeat(halfSpaces) + ' ' + '&nbsp;'.repeat(halfSpaces-1);
          }
          return str.replace(/ /g, spaces);
      }

      // Function that adds breaks to the sentence
      function addBreaks(sentence) {
        // Max width
        let maxWidth = Math.floor(trial.max_width/5);

        // Figure out total length of text on screen
        let ftext = sentence.replaceAll(/ /g, "B".repeat(wordSpaces));
        ftext = ftext.replaceAll("#w#w", "____B____");
        ftext = ftext.replaceAll("#w", "____");
        let total_length = ftext.length;

        // Figure out number of lines, line length, and positions of breaks
        let lines = Math.ceil(total_length/maxWidth);
        let line_length = Math.ceil(total_length/lines);
        let breaks = [];
        
        for (let i = 0; i < lines-1; i++) {
          breaks.push((i+1)*line_length);
        }

        // Go character by character and insert #b (which will be replaced with <br>)
        // between words after max length has been reached
        let out = ``;
        let length = 0;
        let prevlength = 0;
        let prevword = false;
        let needbreak = false;

        for (let i = 0; i < sentence.length; i++) {
          prevlength = length;
          let t = sentence[i];
          if (t == "#") {
            if (!prevword) {
              length += 4; // Words take up four spaces
            } else {
              length += 5; // Words after words take up five spaces (including space)
            }
            prevword = true; // Flag that previous was word
            i++; // Add double to i so skip entire #w
          } else {
            prevword = false;
            if (t == " ") {
              length += 6;
            } else {
              length += 1;
            }
          }
          if ((length >= breaks[0]) && (prevlength < breaks[0])){
            needbreak = true;
            breaks.shift();
          }
          if ((t == " ") && needbreak) {
            out += "#b";
            needbreak = false;
          }

          if (t == "#") {
            out += t + "w";
          } else {
            out += t;
          }
          
        }
        return(out)
      }

    }
  }
  SentenceConstructionPlugin.info = info;

  return SentenceConstructionPlugin;
})(jsPsychModule);
