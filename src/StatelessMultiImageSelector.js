'use-strict';

const React = require('react');
const singleSelectorContainerKeyPrefix = 'whateveryoulike-';

const StatelessSingleImageSelector = require('./StatelessSingleImageSelector').default;

const SINGLE_UPLOADER_STATE = require('./ImageSelectorBundle').SINGLE_UPLOADER_STATE;

class StatelessMultiImageSelector extends React.Component {
  constructor(props) {
    super(props);
  }

  startUpload() {
    const widgetRef = this;
    const props = widgetRef.props;
    const bundleListManager = props.bundleListManager;
    const onSingleUploadedBridge = props.onSingleUploadedBridge;

    const bundleList = bundleListManager.bundleList;
    for (let i = 0; i < bundleList.length; i++) {
      const bundle = bundleList[i];
      if (SINGLE_UPLOADER_STATE.UPLOADED == bundle.uploaderState) {
        onSingleUploadedBridge(i, true);
        continue;
      }
      if (SINGLE_UPLOADER_STATE.LOCALLY_PREVIEWING != bundle.uploaderState) {
        // NOTE: Invalid block here, the player should NEVER trigger this block.
        continue;
      }
      bundle.extUploader.start();
    }
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
    const bundleListManager = props.bundleListManager;
    const shouldDisable = props.shouldDisable;
    const onSingleNewBundleCreatedBridge = props.onSingleNewBundleCreatedBridge;
    const onSingleImageEditorTriggeredBridge = props.onSingleImageEditorTriggeredBridge;
    const onSingleUploadedBridge = props.onSingleUploadedBridge;
    const onSingleProgressBridge = props.onSingleProgressBridge;
    const onSingleLocalImageAddedBridge = props.onSingleLocalImageAddedBridge;
    const singleImageSelectorSize = props.singleImageSelectorSize;
    const uploadEndpoint = props.uploadEndpoint;
    const singleUploadCredentialsEndpoint = props.singleUploadCredentialsEndpoint;
    const showFileRequirementHint = props.showFileRequirementHint;
    const singleFileSizeLimitBytes = props.singleFileSizeLimitBytes;
    const allowedMimeList = props.allowedMimeList;
    const uploadedMark = props.uploadedMark;
    const View = props.View;

    const bundleList = bundleListManager.bundleList;
    let selectorList = [];
    let idleSelectorExists = false;
    for (let i = 0; i < bundleList.length; ++i) {
      const bundle = bundleList[i];
      const isIdle = (SINGLE_UPLOADER_STATE.IDLE == bundle.uploaderState);
      const shouldHide = (idleSelectorExists && isIdle);
      const singleSelector = (
        <View
        key={singleSelectorContainerKeyPrefix + bundle.id}
        style={{
          display: (shouldHide ? 'none' : 'inline-block'),
          marginRight: 5,
        }}
        >
          <StatelessSingleImageSelector
          key={bundle.id}
          listIndex={i}
          bundle={bundle}
          sizePx={singleImageSelectorSize}
          uploadEndpoint={uploadEndpoint}
          singleUploadCredentialsEndpoint={singleUploadCredentialsEndpoint}
          showFileRequirementHint={showFileRequirementHint}
          singleFileSizeLimitBytes={singleFileSizeLimitBytes}
          allowedMimeList={allowedMimeList}
          uploadedMark={uploadedMark}
          progressBarColor={props.progressBarColor}
          BrowserButtonComponent={props.BrowserButtonComponent}
          shouldDisable={ () => {
            return (shouldHide || shouldDisable());
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
      if (isIdle) {
        idleSelectorExists = true;
      }
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
    bundleListManager: React.PropTypes.any.isRequired,
    shouldDisable: React.PropTypes.func.isRequired,

    onSingleImageEditorTriggeredBridge: React.PropTypes.func.isRequired,

    onSingleNewBundleCreatedBridge: React.PropTypes.func.isRequired,

    onSingleUploadedBridge: React.PropTypes.func.isRequired,
    onSingleProgressBridge: React.PropTypes.func.isRequired,
    onSingleLocalImageAddedBridge: React.PropTypes.func.isRequired,

    singleImageSelectorSize: React.PropTypes.any.isRequired,

    uploadEndpoint: React.PropTypes.string.isRequired,
    singleUploadCredentialsEndpoint: React.PropTypes.string.isRequired, 
    showFileRequirementHint: React.PropTypes.func.isRequired,
    singleFileSizeLimitBytes: React.PropTypes.number.isRequired,
    allowedMimeList: React.PropTypes.array.isRequired,

    uploadedMark: React.PropTypes.any.isRequired,
    progressBarColor: React.PropTypes.string.isRequired, 
    BrowserButtonComponent: React.PropTypes.func.isRequired,

    queryAndSetSingleBundleExtUploaderCredentialsAsync: React.PropTypes.func.isRequired,
};

exports.default = StatelessMultiImageSelector;
