import React from "react";
import PropTypes from "prop-types";

import {
  EditorState,
  CompositeDecorator,
  convertFromRaw,
  convertToRaw,
  Modifier,
} from "draft-js";

import CustomEditor from "./CustomEditor.js";
import Word from "./Word";

import sttJsonAdapter from "./stt-adapters";
import style from "./index.module.css";

class Transcription extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  componentDidMount() {
    this.loadData();
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps !== this.props) return true;

    if (nextState !== this.state) return true;

    return false;
  };

  loadData() {
    if (this.props.transcriptData !== null) {
      const blocks = sttJsonAdapter(
        this.props.transcriptData,
        this.props.sttJsonType
      );
      this.setState({ originalState: convertToRaw(convertFromRaw(blocks)) });
      this.setEditorContentState(blocks);
    }
  }

  handleDoubleClick = (event) => {
    // nativeEvent --> React giving you the DOM event
    let element = event.nativeEvent.target;
    // find the parent in Word that contains span with time-code start attribute
    while (!element.hasAttribute("data-start") && element.parentElement) {
      element = element.parentElement;
    }

    if (element.hasAttribute("data-start")) {
      const t = parseFloat(element.getAttribute("data-start"));
      this.props.onWordClick(t);
    }
  };

  getWordCount = (editorState) => {
    const plainText = editorState.getCurrentContent().getPlainText("");
    const regex = /(?:\r\n|\r|\n)/g; // new line, carriage return, line feed
    const cleanString = plainText.replace(regex, " ").trim(); // replace above characters w/ space
    const wordArray = cleanString.match(/\S+/g); // matches words according to whitespace

    return wordArray ? wordArray.length : 0;
  };

  /**
   * @param {object} data.entityMap - draftJs entity maps - used by convertFromRaw
   * @param {object} data.blocks - draftJs blocks - used by convertFromRaw
   * set DraftJS Editor content state from blocks
   * contains blocks and entityMap
   */
  setEditorContentState = (data) => {
    const contentState = convertFromRaw(data);
    // eslint-disable-next-line no-use-before-define
    const editorState = EditorState.createWithContent(contentState, decorator);

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: "TimedTextEditor",
        action: "setEditorContentState",
        name: "getWordCount",
        value: this.getWordCount(editorState),
      });
    }

    this.setState({ editorState }, () => {
      this.forceRenderDecorator();
    });
  };

  // Helper function to re-render this component
  // used to re-render WrapperBlock on timecode offset change
  // or when show / hide preferences for speaker labels and timecodes change
  forceRenderDecorator = () => {
    const contentState = this.state.editorState.getCurrentContent();
    const decorator = this.state.editorState.getDecorator();
    const newState = EditorState.createWithContent(contentState, decorator);
    const newEditorState = EditorState.push(newState, contentState);
    this.setState({ editorState: newEditorState });
  };

  /**
   * Update Editor content state
   */
  setEditorNewContentState = (newContentState) => {
    const decorator = this.state.editorState.getDecorator();
    const newState = EditorState.createWithContent(newContentState, decorator);
    const newEditorState = EditorState.push(newState, newContentState);
    this.setState({ editorState: newEditorState });
  };

  getCurrentWord = () => {
    const currentWord = {
      start: "NA",
      end: "NA",
    };

    if (this.props.transcriptData) {
      const contentState = this.state.editorState.getCurrentContent();
      const contentStateConvertEdToRaw = convertToRaw(contentState);
      const entityMap = contentStateConvertEdToRaw.entityMap;

      for (var entityKey in entityMap) {
        const entity = entityMap[entityKey];
        const word = entity.data;

        if (
          word.start <= this.props.currentTime &&
          word.end >= this.props.currentTime
        ) {
          currentWord.start = word.start;
          currentWord.end = word.end;
        }
      }
    }

    if (currentWord.start !== "NA") {
      if (this.props.isScrollIntoViewOn) {
        const currentWordElement = document.querySelector(
          `span.Word[data-start="${currentWord.start}"]`
        );
       currentWordElement.scrollIntoView({
          block: "nearest",
          inline: "center",
        });
      }
    }

    return currentWord;
  };

  onWordClick = (e) => {
    this.props.onWordClick(e);
  };

  render() {
    const currentWord = this.getCurrentWord();
    const highlightColour = "blue";
    const unplayedColor = "#767676";
    const correctionBorder = "1px dotted blue";

    // Time to the nearest half second
    const time = Math.round(this.props.currentTime * 4.0) / 4.0;

    const editor = (
      <section className={style.editor} onDoubleClick={this.handleDoubleClick}>
        <style scoped>
          {`span.Word[data-start="${currentWord.start}"] { background-color: ${highlightColour}; text-shadow: 0 0 0.01px black }`}
          {`span.Word[data-start="${currentWord.start}"]+span { background-color: ${highlightColour} }`}
          {`span.Word[data-prev-times~="${Math.floor(
            time
          )}"] { color: ${unplayedColor} }`}
          {`span.Word[data-prev-times~="${time}"] { color: ${unplayedColor} }`}
          {`span.Word[data-confidence="low"] { border-bottom: ${correctionBorder} }`}
        </style>
        <CustomEditor
          editorState={this.state.editorState}
          stripPastedStyles
          handleKeyCommand={this.handleKeyCommand}
          timecodeOffset={this.props.timecodeOffset}
          onWordClick={this.onWordClick}
          handleAnalyticsEvents={this.props.handleAnalyticsEvents}
        />
      </section>
    );

    return (
      <section>{this.props.transcriptData !== null ? editor : null}</section>
    );
  }
}

// DraftJs decorator to recognize which entity is which
// and know what to apply to what component
const getEntityStrategy =
  (mutability) => (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      if (entityKey === null) {
        return false;
      }

      return contentState.getEntity(entityKey).getMutability() === mutability;
    }, callback);
  };

// decorator definition - Draftjs
// defines what to use to render the entity
const decorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy("MUTABLE"),
    component: Word,
  },
]);

Transcription.propTypes = {
  transcriptData: PropTypes.object,
  mediaUrl: PropTypes.string,
  onWordClick: PropTypes.func,
  sttJsonType: PropTypes.string,
  isPlaying: PropTypes.func,
  playMedia: PropTypes.func,
  currentTime: PropTypes.number,
  isScrollIntoViewOn: PropTypes.bool,
  isPauseWhileTypingOn: PropTypes.bool,
  timecodeOffset: PropTypes.number,
  handleAnalyticsEvents: PropTypes.func,
  fileName: PropTypes.string,
};

export default Transcription;
