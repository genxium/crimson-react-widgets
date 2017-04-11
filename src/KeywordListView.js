'use-strict';

if(undefined === String.prototype.trim) {
  String.prototype.trim = function() {
    return String(this).replace(/^\s+|\s+$/g, '');
  };
}

const React = require('react');

class KeywordListView extends React.Component {
  constructor(props) {
    super(props);
  }

  _createSingleExistingKeywordView(idx, singleKeyword) {
    const widgetRef = this;
    const props = widgetRef.props;

    const shouldDisable = props.shouldDisable;
    const View = props.View;
    const Button = props.Button;

    const deleteButtonSymbol = props.deleteButtonSymbol;
    const backgroundColor = props.backgroundColor;
    const fontColor = props.fontColor;

    const deleteButtonStyle = {
      display: (shouldDisable() ? 'none' : 'inline-block'),
      borderRadius: 20,
      border: 'none',
      paddingTop: 0,
      paddingLeft: 0,
      paddingBottom:0,
      paddingRight: 5,
      width: 20,
      height: 20,
      backgroundColor: backgroundColor,
      color: fontColor,
    };
    if (undefined !== props.deleteButtonStyle && null !== props.deleteButtonStyle) {
      Object.assign(deleteButtonStyle, props.deleteButtonStyle);
    }

    const keywordList = props.keywordList;
    const onSingleKeywordDeleteTriggeredBridge = props.onSingleKeywordDeleteTriggeredBridge;

    const deleteButton = (
      <Button
      disabled={shouldDisable()}
      style={deleteButtonStyle}
      onPress={ (evt) => {
        onSingleKeywordDeleteTriggeredBridge(idx);  
      }}
      >
        {deleteButtonSymbol}
      </Button>
    );
    return (
      <View
      key={idx}
      style={{
        display: 'inline-block',
        borderRadius: 15,
        margin: 5,
        backgroundColor: backgroundColor,
        color: fontColor,
      }}
      >
        <View
        style={{
          display: 'inline-block',
          padding: 5,
          wordBreak: 'break-word',
        }}
        >
          {singleKeyword}
        </View>
        {deleteButton}
      </View>
    );
  }

  render() {
    const widgetRef = this;
    const props = widgetRef.props;

    const View = props.View;
    const Input = props.Input;
    const Button = props.Button;

    const deleteButtonSymbol = props.deleteButtonSymbol;
    const backgroundColor = props.backgroundColor;
    const fontColor = props.fontColor;
    const terminationHint = props.terminationHint;
  
    const maxCount = props.maxCount;
    const cachedNewKeyword = props.cachedNewKeyword;
    const onTextChangedBridge = props.onTextChangedBridge;

    const shouldDisable = props.shouldDisable;
    const keywordList = props.keywordList;

    const regexForEach = props.regexForEach;
    const onNewKeywordAddTriggeredBridge = props.onNewKeywordAddTriggeredBridge;
    const onRegexViolationBridge = props.onRegexViolationBridge; 

    let existingKeywordList = [];
    if (undefined !== keywordList && null !== keywordList && 0 < keywordList.length) {
      for (let i = 0; i < keywordList.length; ++i) {
        existingKeywordList.push(widgetRef._createSingleExistingKeywordView(i, keywordList[i]));
      }
    }
    const shouldDisableInput = (shouldDisable() || (existingKeywordList.length >= maxCount));
    const newKeywordInput = (
      <Input
      key='new-keyword-input'
      disabled={shouldDisableInput}
      value={cachedNewKeyword}
      placeholder={terminationHint}
      style={{
        display: (shouldDisableInput ? 'none' : 'inline-block'),
        outline: 'none',
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: '15px',
        borderStyle: 'solid',
        borderColor: 'gray',
        borderWidth: '1px',
        margin: 5,
      }}
      onChange={ (evt) => {
        onTextChangedBridge(evt.target.value);
      }}
      onCut={ (evt) => {
        onTextChangedBridge(evt.target.value);
      }}
      onPaste={ (evt) => {
        onTextChangedBridge(evt.target.value);
      }}
      onKeyDown={ (evt) => {
        if (evt.keyCode != 13 /* magic number for RETURN key*/ && evt.keyCode != 9 /* magic number for TAB key */) return;
        evt.preventDefault();
        if (regexForEach.test(evt.target.value)) {
          onNewKeywordAddTriggeredBridge(evt.target.value.trim());
        } else {
          onRegexViolationBridge();
        }
      }}
      />
    );
    return (
      <View
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        paddingRight: 0,
      }}
      >
        {existingKeywordList}
        {newKeywordInput}
      </View> 
    );  
  }
}

KeywordListView.propTypes = {
  View: React.PropTypes.func.isRequired,
  Button: React.PropTypes.func.isRequired,
  Input: React.PropTypes.func.isRequired,

  deleteButtonSymbol: React.PropTypes.any.isRequired,
  deleteButtonStyle: React.PropTypes.object,

  backgroundColor: React.PropTypes.any.isRequired,
  fontColor: React.PropTypes.any.isRequired,

  terminationHint: React.PropTypes.string.isRequired,
  regexForEach: React.PropTypes.any.isRequired,
  keywordList: React.PropTypes.array.isRequired,
  shouldDisable: React.PropTypes.func.isRequired,
  maxCount: React.PropTypes.number.isRequired,
  cachedNewKeyword: React.PropTypes.string.isRequired,

  onRegexViolationBridge: React.PropTypes.func.isRequired,
  onSingleKeywordDeleteTriggeredBridge: React.PropTypes.func.isRequired,
  onNewKeywordAddTriggeredBridge: React.PropTypes.func.isRequired,
  onTextChangedBridge: React.PropTypes.func.isRequired,
}


exports.default = KeywordListView;
