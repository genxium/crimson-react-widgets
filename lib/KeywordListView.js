'use strict';
'use-strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (undefined === String.prototype.trim) {
  String.prototype.trim = function () {
    return String(this).replace(/^\s+|\s+$/g, '');
  };
}

var React = require('react');

var KeywordListView = function (_React$Component) {
  _inherits(KeywordListView, _React$Component);

  function KeywordListView(props) {
    _classCallCheck(this, KeywordListView);

    return _possibleConstructorReturn(this, (KeywordListView.__proto__ || Object.getPrototypeOf(KeywordListView)).call(this, props));
  }

  _createClass(KeywordListView, [{
    key: '_createSingleExistingKeywordView',
    value: function _createSingleExistingKeywordView(idx, singleKeyword) {
      var widgetRef = this;
      var props = widgetRef.props;

      var View = props.View;
      var Button = props.Button;

      var deleteButtonSymbol = props.deleteButtonSymbol;
      var backgroundColor = props.backgroundColor;
      var fontColor = props.fontColor;

      var shouldDisable = props.shouldDisable;
      var keywordList = props.keywordList;
      var onSingleKeywordDeleteTriggeredBridge = props.onSingleKeywordDeleteTriggeredBridge;

      var deleteButton = React.createElement(
        Button,
        {
          disabled: shouldDisable(),
          style: {
            display: shouldDisable() ? 'none' : 'inline-block',
            borderRadius: 20,
            paddingTop: 0,
            paddingLeft: 0,
            paddingBottom: 0,
            paddingRight: 5,
            width: 20,
            height: 20,
            verticalAlign: 'baseline',
            backgroundColor: backgroundColor,
            color: fontColor
          },
          onPress: function onPress(evt) {
            onSingleKeywordDeleteTriggeredBridge(idx);
          }
        },
        deleteButtonSymbol
      );
      return React.createElement(
        View,
        {
          key: idx,
          style: {
            display: 'inline-block',
            borderRadius: 15,
            margin: 5,
            backgroundColor: backgroundColor,
            color: fontColor
          }
        },
        React.createElement(
          View,
          {
            style: {
              display: 'inline-block',
              padding: 5,
              wordBreak: 'break-word'
            }
          },
          singleKeyword
        ),
        deleteButton
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var widgetRef = this;
      var props = widgetRef.props;

      var View = props.View;
      var Input = props.Input;
      var Button = props.Button;

      var deleteButtonSymbol = props.deleteButtonSymbol;
      var backgroundColor = props.backgroundColor;
      var fontColor = props.fontColor;
      var terminationHint = props.terminationHint;

      var maxCount = props.maxCount;
      var cachedNewKeyword = props.cachedNewKeyword;
      var onTextChangedBridge = props.onTextChangedBridge;

      var shouldDisable = props.shouldDisable;
      var keywordList = props.keywordList;

      var regexForEach = props.regexForEach;
      var onNewKeywordAddTriggeredBridge = props.onNewKeywordAddTriggeredBridge;
      var onRegexViolationBridge = props.onRegexViolationBridge;

      var existingKeywordList = [];
      if (undefined !== keywordList && null !== keywordList && 0 < keywordList.length) {
        for (var i = 0; i < keywordList.length; ++i) {
          existingKeywordList.push(widgetRef._createSingleExistingKeywordView(i, keywordList[i]));
        }
      }
      var shouldDisableInput = shouldDisable() || existingKeywordList.length >= maxCount;
      var newKeywordInput = React.createElement(Input, {
        key: 'new-keyword-input',
        disabled: shouldDisableInput,
        value: cachedNewKeyword,
        placeholder: terminationHint,
        style: {
          display: shouldDisableInput ? 'none' : 'inline-block',
          outline: 'none',
          paddingTop: 3,
          paddingBottom: 3,
          paddingLeft: 6,
          paddingRight: 6,
          borderRadius: '15px',
          borderStyle: 'solid',
          borderColor: 'gray',
          borderWidth: '1px',
          margin: 5
        },
        onChange: function onChange(evt) {
          onTextChangedBridge(evt.target.value);
        },
        onCut: function onCut(evt) {
          onTextChangedBridge(evt.target.value);
        },
        onPaste: function onPaste(evt) {
          onTextChangedBridge(evt.target.value);
        },
        onKeyDown: function onKeyDown(evt) {
          if (evt.keyCode != 13 /* magic number for RETURN key*/ && evt.keyCode != 9 /* magic number for TAB key */) return;
          evt.preventDefault();
          if (regexForEach.test(evt.target.value)) {
            onNewKeywordAddTriggeredBridge(evt.target.value.trim());
          } else {
            onRegexViolationBridge();
          }
        }
      });
      return React.createElement(
        View,
        {
          style: {
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 0,
            paddingRight: 0
          }
        },
        existingKeywordList,
        newKeywordInput
      );
    }
  }]);

  return KeywordListView;
}(React.Component);

KeywordListView.propTypes = {
  View: React.PropTypes.func.isRequired,
  Button: React.PropTypes.func.isRequired,
  Input: React.PropTypes.func.isRequired,

  deleteButtonSymbol: React.PropTypes.any.isRequired,
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
  onTextChangedBridge: React.PropTypes.func.isRequired
};

exports.default = KeywordListView;

