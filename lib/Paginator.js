'use strict';

const sharedLib = require('./shared');
const React = require('react');

class Paginator extends React.Component {

  requestDataAsync(requestedPage) {
		const widgetRef = this;
		const props = widgetRef.props;
		const dataUrl = props.dataUrl;
		const collectFilters = props.collectFilters;
    const paramDict = {
			page: requestedPage,
    };

		Object.assign(paramDict, collectFilters());
    return sharedLib.httpGet(dataUrl, paramDict)
    .then(function(response) {
      return response.json();
    })
    .then(function(responseData) {
			return new Promise(function(resolve, reject) {
				resolve(responseData);	
			});
		});
  }

  _createNoResultHeader(idx) {
    const widgetRef = this;
		const props = widgetRef.props;
		const View = props.View;
		const Image = props.Image;
		const noResultHint = React.createElement(View, {
			key: 'paginator-no-result-hint',
		}, `${props.noResultHint}`);
		const noResultHintIcon = React.createElement(props.noResultHintIcon, {
			key: 'paginator-no-result-hint-icon',
		}, null);

		return React.createElement(View, {
			idx: idx,
			key: idx,
			ref: (c) => {
				if (!c) return;
				const newHeight = sharedLib.getRenderedComponentSize(c).height;
				const theIdx = c.props.idx;
				let headerHeightDict = {};
				for (let k in widgetRef.state.headerHeightDict) {
					headerHeightDict[k] = widgetRef.state.headerHeightDict[k]; 
				}
				const oldHeight = (!headerHeightDict.hasOwnProperty(theIdx) ? null : headerHeightDict[theIdx]);	
				if (oldHeight == newHeight) return;	
			
				headerHeightDict[theIdx] = newHeight;
				widgetRef.setState({
					headerHeightDict: headerHeightDict,
				});
			},
			style: {
      	textAlign: 'center',
			}
		}, [
			noResultHint,
			noResultHintIcon,
		]);
  }

	constructor(props) {
		super(props);

    this._footerHeightPx = 32;
    this.styles = {
      footer: {
				position: 'relative',
        left: 0,
        right: 0,
				height: this._footerHeightPx,
      },
      footerBtn: {
        position: 'absolute',
        width: '40%',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        padding: '0',
        verticalAlign: 'middle',
        height: this._footerHeightPx
      },
      activePage: {
        position: 'absolute',
        width: '20%',
        lineHeight: this._footerHeightPx.toString() + 'px',
        height: this._footerHeightPx,
        fontSize: 20,
        textAlign: 'center',
        verticalAlign: 'middle',
        left: '40%'
      },
    }

		this._listviewRef = null;
		this._footerRef = null;
		
		this.state = {
			headerHeightDict: {},
			cellHeightDict: {},
		};
	}

	_wrapSingleCell(idx, singleCell) {
		const widgetRef = this;
		const props = widgetRef.props;
		const View = props.View;
		
		const wrappedCell = React.createElement(View, {
			idx: idx,	
			key: idx,
			ref: (c) => {
				if (!c) return;
				const newHeight = sharedLib.getRenderedComponentSize(c).height;
				const theIdx = c.props.idx;
				let cellHeightDict = {};
				for (let k in widgetRef.state.cellHeightDict) {
					cellHeightDict[k] = widgetRef.state.cellHeightDict[k]; 
				}
				const oldHeight = (!cellHeightDict.hasOwnProperty(theIdx) ? null : cellHeightDict[theIdx]);	

				if (oldHeight == newHeight) return;	
				cellHeightDict[theIdx] = newHeight;
				widgetRef.setState({
					cellHeightDict: cellHeightDict,
				});
			}
		}, singleCell);

		return wrappedCell;
	}

	_wrapSingleHeader(idx, singleHeader) {
		const widgetRef = this;
		const props = widgetRef.props;
		const View = props.View;
		const wrappedHeader = React.createElement(View, {
			idx: idx,	
			key: idx,
			ref: (c) => {
				if (!c) return;
				const newHeight = sharedLib.getRenderedComponentSize(c).height;
				const theIdx = c.props.idx;
				let headerHeightDict = {};
				for (let k in widgetRef.state.headerHeightDict) {
					headerHeightDict[k] = widgetRef.state.headerHeightDict[k]; 
				}
				const oldHeight = (!headerHeightDict.hasOwnProperty(theIdx) ? null : headerHeightDict[theIdx]);	

				if (oldHeight == newHeight) return;	
				headerHeightDict[theIdx] = newHeight;
				widgetRef.setState({
					headerHeightDict: headerHeightDict,
				});
			}
		}, singleHeader);
		return wrappedHeader;
	}

	render() {
		const widgetRef = this;
		const props = widgetRef.props;
		const View = props.View;
		const Text = props.Text;
		const Image = props.Image;
		const Button = props.Button;
		const totSizePx = props.totSizePx;
		const activePage = props.activePage;
		const onPageSelectedBridge = props.onPageSelectedBridge;
		const cellHeight = props.cellHeight;
		const cellList = props.cellList;
		const presetHeaderList = props.presetHeaderList;
		const nPerPage = props.nPerPage;
		const BackArrow = props.BackArrow;
		
		const styles = widgetRef.styles;
		const page = activePage();

		const shouldDisplayBackwardBtn = (1 < page);
		const effectivePresetHeaderCount = (undefined === presetHeaderList || null === presetHeaderList ? 0 : presetHeaderList.length);
		const netCellCount = cellList.length;
		const shouldDisplayNoResultHeader = (0 >= netCellCount);
		const dynamicNperpage = (undefined === nPerPage ? 10 /* temporarily hardcoded magic number */ : nPerPage); 
		const shouldDisplayForwardBtn = (!shouldDisplayNoResultHeader && dynamicNperpage <= netCellCount);

		let wrappedHeaderList = [];
		if (undefined !== presetHeaderList && null !== presetHeaderList) {
			for (let i = 0; i < presetHeaderList.length; ++i) {
				const wrappedHeader = widgetRef._wrapSingleHeader(i, presetHeaderList[i]);
				wrappedHeaderList.push(wrappedHeader);
			}	
		}

		const noResultHeaderIdx = effectivePresetHeaderCount;
		const noResultHeader = (shouldDisplayNoResultHeader ? widgetRef._createNoResultHeader(noResultHeaderIdx) : null);

		if (null !== noResultHeader) {
			wrappedHeaderList.push(noResultHeader);
		}

		let wrappedCellList = [];
		for (let i = 0; i < cellList.length; ++i) {
			const wrappedCell = widgetRef._wrapSingleCell(i + wrappedHeaderList.length, cellList[i]);
			wrappedCellList.push(wrappedCell);	
		} 

		let allCellList = [];	
		for (let i = 0; i < wrappedHeaderList.length; ++i) {
			allCellList.push(wrappedHeaderList[i]);
		}	
		for (let i = 0; i < wrappedCellList.length; ++i) {
			allCellList.push(wrappedCellList[i]);
		}
		
		let allCellHeightList = [];
		for (let i = 0; i < wrappedHeaderList.length; ++i) {
			let theIdx = i;
			if (widgetRef.state.headerHeightDict.hasOwnProperty(theIdx)) {
				allCellHeightList.push(widgetRef.state.headerHeightDict[theIdx]);
			} else {
				allCellHeightList.push(cellHeight);
			}
		} 

		for (let i = 0; i < wrappedCellList.length; ++i) {
			let theIdx = (i + wrappedHeaderList.length);
			if (widgetRef.state.cellHeightDict.hasOwnProperty(theIdx)) {
				allCellHeightList.push(widgetRef.state.cellHeightDict[theIdx]);
			} else {
				allCellHeightList.push(cellHeight);
			}
		}

		const backArrowElement = React.createElement(BackArrow, null, null);

    const backwardBtn = React.createElement(Button, {
			key: 'paginator-backward-btn',
      onPress: (evt) => {
				const selectedPage = page - 1;
				onPageSelectedBridge(selectedPage);
			},
      style: Object.assign( {
				display: (shouldDisplayBackwardBtn ? 'inline' : 'none'),
				left: '0',
				transform: 'scaleX(-1)',
			}, styles.footerBtn),
		}, backArrowElement); 

    const forwardBtn = React.createElement(Button, {
			key: 'paginator-forward-btn',
      onPress: (evt) => {
				const selectedPage = page + 1;
				onPageSelectedBridge(selectedPage);
			},
      style: Object.assign( {
				display: (shouldDisplayForwardBtn ? 'inline' : 'none'),
				left: '60%'
			}, styles.footerBtn)
		}, backArrowElement);

		let footer = null;
    const onFooterMounted = (c) => {
			if (!c) return;
			if (null !== widgetRef._footerRef) return;
      widgetRef._footerRef = c;
    };

		let listView = null;
		const wrapperHeight = (totSizePx.height - widgetRef._footerHeightPx);

		const listViewProps = Object.assign({
			key: 'paginator-listview',
			style: {
				height: wrapperHeight,
				overflowY: 'scroll',
				WebkitOverflowScrolling: 'touch',
			},
			ref: (c) => {
				if (null === c) return;
				if (null !== widgetRef._listviewRef) return;
				widgetRef._listviewRef = c;
			},
		});

	
		listView = React.createElement(View, listViewProps, allCellList);

		const footerStyle = {};
		Object.assign(footerStyle, styles.footer);

		const pageIndicator = React.createElement(View, {
			key: 'paginator-page-indicator',
			style: styles.activePage,
		}, `${page}`);

		footer = React.createElement(View, {
			key: 'paginator-footer',
			ref: onFooterMounted,
			style: footerStyle,
		}, [backwardBtn, pageIndicator, forwardBtn]);

		const overallStyle = {
		};

		Object.assign(overallStyle, widgetRef.props.style);
		
		return React.createElement(View, {
			style: overallStyle,
		}, [listView, footer]);
	}
}

exports.default = Paginator;
