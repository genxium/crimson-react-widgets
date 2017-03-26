'use strict';
'use-strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var singleSelectorContainerKeyPrefix = 'whateveryoulike-';

var StatelessSingleImageSelector = require('./StatelessSingleImageSelector').default;

var SINGLE_UPLOADER_STATE = require('./ImageSelectorBundle').SINGLE_UPLOADER_STATE;
var BATCH_UPLOADER_STATE = require('./ImageSelectorBundle').BATCH_UPLOADER_STATE;

var StatelessMultiImageSelector = function (_React$Component) {
  _inherits(StatelessMultiImageSelector, _React$Component);

  function StatelessMultiImageSelector(props) {
    _classCallCheck(this, StatelessMultiImageSelector);

    var _this = _possibleConstructorReturn(this, (StatelessMultiImageSelector.__proto__ || Object.getPrototypeOf(StatelessMultiImageSelector)).call(this, props));

    _this._singleSelectorCollection = {};
    return _this;
  }

  _createClass(StatelessMultiImageSelector, [{
    key: 'startUpload',
    value: function startUpload() {
      var widgetRef = this;
      for (var k in widgetRef._singleSelectorCollection) {
        var singleSelector = widgetRef._singleSelectorCollection[k];
        if (!singleSelector) continue;
        singleSelector.startUpload();
      };
    }
  }, {
    key: 'getPreviewableImageList',
    value: function getPreviewableImageList() {
      var widgetRef = this;
      var props = widgetRef.props;
      var bundleListManager = props.bundleListManager;

      var bundleList = bundleListManager.bundleList;
      if (0 == bundleList.length) return null;
      var imageList = [];
      for (var i = 0; i < bundleList.length; ++i) {
        var bundle = bundleList[i];
        if (null === bundle.effectiveImgSrc) break;
        imageList.push({
          src: bundle.effectiveImgSrc
        });
      }
      ;
      return imageList;
    }
  }, {
    key: 'getBatchUploaderStateSync',
    value: function getBatchUploaderStateSync() {
      var toRet = 0;
      var widgetRef = this;
      var props = widgetRef.props;
      var bundleListManager = props.bundleListManager;

      var bundleList = bundleListManager.bundleList;
      if (0 == bundleList.length) return BATCH_UPLOADER_STATE.NONEXISTENT_UPLOADER;

      for (var i = 0; i < bundleList.length; ++i) {
        var bundle = bundleList[i];
        if (SINGLE_UPLOADER_STATE.CREATED == bundle.uploaderState) toRet |= BATCH_UPLOADER_STATE.SOME_CREATED;else if (SINGLE_UPLOADER_STATE.INITIALIZED == bundle.uploaderState) toRet |= BATCH_UPLOADER_STATE.SOME_INITIALIZED;else if (SINGLE_UPLOADER_STATE.LOCALLY_PREVIEWING == bundle.uploaderState) toRet |= BATCH_UPLOADER_STATE.SOME_LOCALLY_PREVIEWING;else if (SINGLE_UPLOADER_STATE.UPLOADING == bundle.uploaderState) toRet |= BATCH_UPLOADER_STATE.SOME_UPLOADING;else continue; // UPLOADED
      }
      return toRet;
    }
  }, {
    key: 'render',
    value: function render() {
      var widgetRef = this;
      var props = widgetRef.props;

      var View = props.View;

      var bundleListManager = props.bundleListManager;
      var _shouldDisable = props.shouldDisable;
      var onSingleNewBundleInitializedBridge = props.onSingleNewBundleInitializedBridge;
      var onSingleImageEditorTriggeredBridge = props.onSingleImageEditorTriggeredBridge;
      var onSingleUploadedBridge = props.onSingleUploadedBridge;
      var onSingleProgressBridge = props.onSingleProgressBridge;
      var onSingleLocalImageAddedBridge = props.onSingleLocalImageAddedBridge;
      var singleImageSelectorSize = props.singleImageSelectorSize;
      var showFileRequirementHint = props.showFileRequirementHint;
      var singleFileSizeLimitBytes = props.singleFileSizeLimitBytes;
      var allowedMimeList = props.allowedMimeList;
      var uploadedMark = props.uploadedMark;

      var bundleList = bundleListManager.bundleList;
      var selectorList = [];

      var _loop = function _loop(i) {
        var bundle = bundleList[i];
        var singleSelector = React.createElement(
          View,
          {
            key: singleSelectorContainerKeyPrefix + i.toString(),
            style: {
              display: 'inline-block',
              marginRight: 5
            }
          },
          React.createElement(StatelessSingleImageSelector, _extends({
            key: bundle.id,
            listIndex: i,
            ref: function ref(c) {
              // NOTE: Deliberately not excluding the null refs!
              widgetRef._singleSelectorCollection[i] = c;
            },
            bundle: bundle,
            sizePx: singleImageSelectorSize,
            showFileRequirementHint: showFileRequirementHint,
            singleFileSizeLimitBytes: singleFileSizeLimitBytes,
            allowedMimeList: allowedMimeList,
            uploadedMark: uploadedMark,
            progressBarColor: props.progressBarColor,
            BrowserButtonComponent: props.BrowserButtonComponent,
            shouldDisable: function shouldDisable() {
              return _shouldDisable();
            },
            onNewBundleInitializedBridge: function onNewBundleInitializedBridge(idx, props) {
              onSingleNewBundleInitializedBridge(idx, props);
            },
            onImageEditorTriggeredBridge: function onImageEditorTriggeredBridge(idx) {
              onSingleImageEditorTriggeredBridge(idx);
            },
            onUploadedBridge: function onUploadedBridge(idx, successOrFailure) {
              onSingleUploadedBridge(idx, successOrFailure);
            },
            onProgressBridge: function onProgressBridge(idx, props) {
              onSingleProgressBridge(idx, props);
            },
            onLocalImageAddedBridge: function onLocalImageAddedBridge(idx, props) {
              onSingleLocalImageAddedBridge(idx, props);
            }
          }, widgetRef.props))
        );
        selectorList.push(singleSelector);
      };

      for (var i = 0; i < bundleList.length; ++i) {
        _loop(i);
      }

      return React.createElement(
        View,
        {
          style: widgetRef.props.style },
        selectorList
      );
    }
  }]);

  return StatelessMultiImageSelector;
}(React.Component);

StatelessMultiImageSelector.propTypes = {
  View: React.PropTypes.func.isRequired,
  Image: React.PropTypes.func.isRequired,

  bundleListManager: React.PropTypes.any.isRequired,
  shouldDisable: React.PropTypes.func.isRequired,

  onSingleImageEditorTriggeredBridge: React.PropTypes.func.isRequired,

  onSingleNewBundleInitializedBridge: React.PropTypes.func.isRequired,

  onSingleUploadedBridge: React.PropTypes.func.isRequired,
  onSingleProgressBridge: React.PropTypes.func.isRequired,
  onSingleLocalImageAddedBridge: React.PropTypes.func.isRequired,

  singleImageSelectorSize: React.PropTypes.any.isRequired,

  showFileRequirementHint: React.PropTypes.func.isRequired,
  singleFileSizeLimitBytes: React.PropTypes.number.isRequired,
  allowedMimeList: React.PropTypes.array.isRequired,

  uploadedMark: React.PropTypes.any.isRequired,
  progressBarColor: React.PropTypes.string.isRequired,
  BrowserButtonComponent: React.PropTypes.func.isRequired,

  queryAndSetSingleBundleExtUploaderCredentialsAsync: React.PropTypes.func.isRequired
};

exports.default = StatelessMultiImageSelector;

