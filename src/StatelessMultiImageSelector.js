'use-strict';

const React = require('react');
const singleSelectorContainerKeyPrefix = 'whateveryoulike-';

const StatelessSingleImageSelector = require('./StatelessSingleImageSelector').default;

const SINGLE_UPLOADER_STATE = require('./ImageSelectorBundle').SINGLE_UPLOADER_STATE;

class StatelessMultiImageSelector extends React.Component {
  constructor(props) {
    super(props);
    this._singleSelectorCollection = {};
  }

  startUpload() {
    const widgetRef = this;
    for (let k in widgetRef._singleSelectorCollection) {
      const singleSelector = widgetRef._singleSelectorCollection[k];
      if (!singleSelector) continue;
      singleSelector.startUpload();
    };
  }

  getPreviewableImageList() {
    const widgetRef = this;
    const props = widgetRef.props;
    const bundleListManager = props.bundleListManager;

    const bundleList = bundleListManager.bundleList;
    if (0 == bundleList.length) return null;
    let imageList = [];
    for (let i = 0; i < bundleList.length; ++i) {
      const bundle = bundleList[i];
      if (null === bundle.effectiveImgSrc) break;
      imageList.push({
        src: bundle.effectiveImgSrc,
      });
    }
    ;
    return imageList;
  }

  render() {
    const widgetRef = this;
    const props = widgetRef.props;

    const View = props.View;

    const bundleListManager = props.bundleListManager;
    const shouldDisable = props.shouldDisable;
    const onSingleNewBundleCreatedBridge = props.onSingleNewBundleCreatedBridge;
    const onSingleImageEditorTriggeredBridge = props.onSingleImageEditorTriggeredBridge;
    const onSingleUploadedBridge = props.onSingleUploadedBridge;
    const onSingleProgressBridge = props.onSingleProgressBridge;
    const onSingleLocalImageAddedBridge = props.onSingleLocalImageAddedBridge;
    const singleImageSelectorSize = props.singleImageSelectorSize;
    const showFileRequirementHint = props.showFileRequirementHint;
    const singleFileSizeLimitBytes = props.singleFileSizeLimitBytes;
    const allowedMimeList = props.allowedMimeList;
    const uploadedMark = props.uploadedMark;

    const bundleList = bundleListManager.bundleList;
    let selectorList = [];
    for (let i = 0; i < bundleList.length; ++i) {
      const bundle = bundleList[i];
      const singleSelector = (
        <View
        key={singleSelectorContainerKeyPrefix + bundle.id}
        style={{
          display: 'inline-block',
          marginRight: 5,
        }}
        >
          <StatelessSingleImageSelector
          key={bundle.id}
          listIndex={i}
          ref={(c) => {
            // NOTE: Deliberately not excluding the null refs!
            widgetRef._singleSelectorCollection[i] = c;
          }}
          bundle={bundle}
          sizePx={singleImageSelectorSize}
          showFileRequirementHint={showFileRequirementHint}
          singleFileSizeLimitBytes={singleFileSizeLimitBytes}
          allowedMimeList={allowedMimeList}
          uploadedMark={uploadedMark}
          progressBarColor={props.progressBarColor}
          BrowserButtonComponent={props.BrowserButtonComponent}
          shouldDisable={ () => {
            return shouldDisable();
          }}
          onNewBundleCreatedBridge={ (idx, props) => {
            onSingleNewBundleCreatedBridge(idx, props); 
          }}
          onImageEditorTriggeredBridge={ (idx) => {
            onSingleImageEditorTriggeredBridge(idx);
          }}
          onUploadedBridge= { (idx, successOrFailure) => {
            onSingleUploadedBridge(idx, successOrFailure);
          }}
          onProgressBridge={ (idx, props) => {
            onSingleProgressBridge(idx, props);
          }}
          onLocalImageAddedBridge={ (idx, props) => {
            onSingleLocalImageAddedBridge(idx, props);
          }}
          {...widgetRef.props}
          />
        </View>
      );
      selectorList.push(singleSelector);
    }

    return (
      <View
      style={widgetRef.props.style}>
        {selectorList}
      </View>
    );
  }
}

StatelessMultiImageSelector.propTypes = {
  View: React.PropTypes.func.isRequired, 
  Image: React.PropTypes.func.isRequired, 

  bundleListManager: React.PropTypes.any.isRequired,
  shouldDisable: React.PropTypes.func.isRequired,

  onSingleImageEditorTriggeredBridge: React.PropTypes.func.isRequired,

  onSingleNewBundleCreatedBridge: React.PropTypes.func.isRequired,

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

  queryAndSetSingleBundleExtUploaderCredentialsAsync: React.PropTypes.func.isRequired,
};

exports.default = StatelessMultiImageSelector;
