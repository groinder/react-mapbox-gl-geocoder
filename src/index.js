import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MapboxClient from 'mapbox';
import {WebMercatorViewport} from 'viewport-mercator-project';

class Geocoder extends Component {
    debounceTimeout = null;
    state = {
        results: [],
        showResults: false,
        inputValue: ''
    };

    static getDerivedStateFromProps(nextProps, state) {
        if (state.inputValue.length === 0 && nextProps.initialInputValue !== '') {
            return {
                inputValue: nextProps.initialInputValue
            };
        }

        return null;
    }

    onChange = (event) => {
        const {timeout, queryParams, localGeocoder, limit, localOnly} = this.props;
        const queryString = event.target.value;

        this.setState({
            inputValue: event.target.value
        });

        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            const localResults = localGeocoder ? localGeocoder(queryString) : [];
            const params = {...queryParams, ...{limit: limit - localResults.length}};

            if (params.limit > 0 && !localOnly && queryString.length > 0) {
                this.client.geocodeForward(queryString, params).then((res) => {
                    this.setState({
                        results: [...localResults, ...res.entity.features]
                    });
                });
            } else {
                this.setState({
                    results: localResults
                });
            }
        }, timeout);
    };
    onSelected = (item) => {
        const {viewport, onSelected, transitionDuration, hideOnSelect, pointZoom, formatItem, updateInputOnSelect} = this.props;
        let newViewport = new WebMercatorViewport(viewport);
        const {bbox, center} = item;

        if (bbox) {
            newViewport = newViewport.fitBounds([
                [bbox[0], bbox[1]],
                [bbox[2], bbox[3]]
            ]);
        } else {
            newViewport = {
                longitude: center[0],
                latitude: center[1],
                zoom: pointZoom
            };
        }

        const {longitude, latitude, zoom} = newViewport;

        onSelected({...viewport, ...{longitude, latitude, zoom, transitionDuration}}, item);

        if (hideOnSelect) {
            this.setState({results: []});
        }

        if (updateInputOnSelect) {
            this.setState({inputValue: formatItem(item)});
        }
    };

    showResults = () => {
        if(this.props.onFocus) {
            this.props.onFocus()
        }
        this.setState({showResults: true});
    };

    hideResults = () => {
        if(this.props.onBlur) {
            this.props.onBlur()
        }

        setTimeout(() => {
            this.setState({showResults: false});
        }, 300);
    };

    constructor(props) {
        super();

        this.client = new MapboxClient(props.mapboxApiAccessToken);
    }

    render() {
        const {results, showResults, inputValue} = this.state;
        const {formatItem, className, inputComponent, itemComponent} = this.props;

        const Input = inputComponent || 'input';
        const Item = itemComponent || 'div';

        return (
            <div className={`react-geocoder ${className}`}>
                <Input onChange={this.onChange} onBlur={this.hideResults} onFocus={this.showResults} value={inputValue} />

                {showResults && !!results.length &&
                <div className='react-geocoder-results'>
                    {results.map((item, index) => (
                        <Item
                            key={index} className='react-geocoder-item' onClick={() => this.onSelected(item)}
                            item={item}
                        >
                            {formatItem(item)}
                        </Item>
                    ))}
                </div>}
            </div>
        );
    }
}

Geocoder.propTypes = {
    timeout: PropTypes.number,
    queryParams: PropTypes.object,
    viewport: PropTypes.object.isRequired,
    onSelected: PropTypes.func.isRequired,
    transitionDuration: PropTypes.number,
    hideOnSelect: PropTypes.bool,
    pointZoom: PropTypes.number,
    mapboxApiAccessToken: PropTypes.string.isRequired,
    formatItem: PropTypes.func,
    className: PropTypes.string,
    inputComponent: PropTypes.func,
    itemComponent: PropTypes.func,
    limit: PropTypes.number,
    localGeocoder: PropTypes.func,
    localOnly: PropTypes.bool,
    updateInputOnSelect: PropTypes.bool,
    initialInputValue: PropTypes.string,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
};

Geocoder.defaultProps = {
    timeout: 300,
    transitionDuration: 0,
    hideOnSelect: false,
    updateInputOnSelect: false,
    pointZoom: 16,
    formatItem: item => item.place_name,
    queryParams: {},
    className: '',
    limit: 5,
    initialInputValue: ''
};

export default Geocoder;
