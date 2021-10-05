import React from "react";
import PropTypes from "prop-types";
import { Editor } from "draft-js";
import WrapperBlock from './WrapperBlock';

class CustomEditor extends React.Component {
  handleWordClick = e => {
    this.props.onWordClick(e);
  };

  renderBlockWithTimecodes = () => {
    return {
      component: WrapperBlock,
      editable: false,
      props: {
        showTimecodes: true,
        timecodeOffset: this.props.timecodeOffset,
        editorState: this.props.editorState,
        onWordClick: this.handleWordClick,
        handleAnalyticsEvents: this.props.handleAnalyticsEvents,
        //isEditable: false
      }
    };
  };

  shouldComponentUpdate(nextProps) {
    if (nextProps.editorState !== this.props.editorState) {
      return true;
    }


    return false;
  }

  handleOnChange = e => {
    //returns an empty change event to draft.js as were not requiring the editor functions
    //this.props.onChange(e);
  };

  
  render() {

    return (
      <div style={ { cursor: 'default' } }>
        <Editor
          editorState={ this.props.editorState }
          onChange={ this.handleOnChange }
          stripPastedStyles
          blockRendererFn={ this.renderBlockWithTimecodes }
          handleKeyCommand={ this.props.handleKeyCommand }
        />
      </div>
    );
  }
}

export default CustomEditor;
