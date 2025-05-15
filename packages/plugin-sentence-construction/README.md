# plugin-sentence-completion

## Overview

This plugin provides a bank of buttons, and allows the participant to build a sentence piece-by-piece on-screen by clicking those buttons. They can either build the sentence from scratch, or the experimenter can provide a sentence frame to the `sentence` parameter (with gaps to-be-filled indicated by `#w`). Each button click adds one element to the sentence. Elements can be whole words or smaller pieces (syllables or morphemes).

## Loading

### In browser

```js
<script src="https://unpkg.com/@jspsych-contrib/plugin-sentence-completion@0.0.1"></script>
```

### Via NPM

```
npm install @jspsych-contrib/plugin-sentence-completion
```

```js
import jsPsychPluginSentenceCompletion from '@jspsych-contrib/plugin-sentence-completion';
```

## Compatibility

`plugin-sentence-completion` requires jsPsych v8.0.0 or later.

## Documentation

See [documentation](/plugin-sentence-completion/README.md)

## Author / Citation

[Aislinn Keogh, Christian Mott, and Bran Papineau](https://github.com/aislinnkeogh)