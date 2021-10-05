import React from 'react';
import {
  EditorBlock,
  Modifier,
  EditorState,
  SelectionState,
  convertFromRaw,
  convertToRaw
} from 'draft-js';

//import SpeakerLabel from './SpeakerLabel';
// import { shortTimecode, secondsToTimecode } from '../../Util/timecode-converter/';

import {
  shortTimecode,
  secondsToTimecode
} from './util/timecode-converter';

// eslint-disable-next-line css-modules/no-unused-class
import style from './WrapperBlock.module.css';

/*const updateSpeakerName = (oldName, newName, state) => {
  const contentToUpdate = convertToRaw(state);

  contentToUpdate.blocks.forEach(block => {
    if (block.data.speaker === oldName) {
      block.data.speaker = newName;
    }
  });

  return convertFromRaw(contentToUpdate);
};*/


class WrapperBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      speaker: '',
      start: 0,
      timecodeOffset: this.props.blockProps.timecodeOffset
    };
  }

  componentDidMount() {
    const { block } = this.props;
    const speaker = block.getData().get('speaker');

    const start = block.getData().get('start');

    this.setState({
      speaker: speaker,
      start: start
    });
  }
  // reducing unnecessary re-renders
  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.block.getText() !== this.props.block.getText()) {
      return true;
    }

    /*if (nextProps.blockProps.showSpeakers !== this.props.blockProps.showSpeakers) {
      return true;
    }*/

    /*if (nextProps.blockProps.showTimecodes !== this.props.blockProps.showTimecodes) {
      return true;
    }*/

    if (nextProps.blockProps.timecodeOffset !== this.props.blockProps.timecodeOffset) {
      return true;
    }

    if (nextState.speaker !== this.state.speaker) {
      return true;
    }

    /*if (nextProps.blockProps.isEditable !== this.props.blockProps.isEditable) {
      return true;
    }*/

    if (nextProps.block.getData().get('speaker') !== this.state.speaker) {
     // console.log('shouldComponentUpdate wrapper speaker', nextProps.block.getData().get('speaker'), this.state.speaker );
      
      return true;
    }
    
    return false;
  };

  componentDidUpdate  = (prevProps, prevState) =>{

    if (prevProps.block.getData().get('speaker') !== prevState.speaker) {
     // console.log('componentDidUpdate wrapper speaker', prevProps.block.getData().get('speaker'), prevState.speaker );

      this.setState({
        speaker: prevProps.block.getData().get('speaker')
      });

      return true;
    }
  }

  handleTimecodeClick = () => {
    this.props.blockProps.onWordClick(this.state.start);
    if (this.props.blockProps.handleAnalyticsEvents) {
      this.props.blockProps.handleAnalyticsEvents({
        category: 'WrapperBlock',
        action: 'handleTimecodeClick',
        name: 'onWordClick',
        value: secondsToTimecode(this.state.start)
      });
    }
  };

  render() {
    let startTimecode = this.state.start;
    if (this.props.blockProps.timecodeOffset) {
      startTimecode += this.props.blockProps.timecodeOffset;
    }

    const timecodeElement = (
      <span className={ style.time } onClick={ this.handleTimecodeClick }>
        {shortTimecode(startTimecode)}
      </span>
    );

    return (
      <div className={ style.WrapperBlock }>
        <div
          className={ [ style.markers, style.unselectable ].join(' ') }
          
          contentEditable={ false }
        >
          {/*this.props.blockProps.showSpeakers ? speakerElement : ''*/}

          {this.props.blockProps.showTimecodes ? timecodeElement : ''}
        </div>
        <div className={ style.text } >
          {<EditorBlock { ...this.props } />}
        </div>
      </div>
    );
  }
}

export default WrapperBlock;
