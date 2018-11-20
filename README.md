# react-mapbox-gl-geocoder

Simple react autocomplete for geocoding locations using [Mapbox API](https://www.mapbox.com/api-documentation/?language=JavaScript#introduction). You can use it with [react-map-gl](https://github.com/uber/react-map-gl) to pan to found locations.

[![NPM](https://img.shields.io/npm/v/react-mapbox-gl-geocoder.svg)](https://www.npmjs.com/package/react-mapbox-gl-geocoder) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-mapbox-gl-geocoder
# or
yarn add react-mapbox-gl-geocoder
```

## Usage

```jsx
import React, {Component} from 'react'
import Geocoder from 'react-mapbox-gl-geocoder'
import ReactMapGL from 'react-map-gl'
import './index.css'

const mapAccess = {
    mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN
}

const mapStyle = {
    width: '100%',
    height: 600
}

const queryParams = {
    country: 'us'
}

class App extends Component {
    state = {
        viewport: {}
    }

    onSelected = (viewport, item) => {
        this.setState({viewport});
        console.log('Selected: ', item)
    }

    render() {
        const {viewport} = this.state

        return (
            <div>
                <Geocoder
                    {...mapAccess} onSelected={this.onSelected} viewport={viewport} hideOnSelect={true}
                    queryParams={queryParams}
                />

                <ReactMapGL
                    {...mapAccess} {...viewport} {...mapStyle}
                    onViewportChange={(newViewport) => this.setState({viewport: newViewport})}
                />
            </div>
        )
    }
}
```

## Props

| Name                 | Type              | Description | Default |
| -------------------- | ----------------- | ----------- | ------- |
| mapboxApiAccessToken | (required) string | [Mapbox Access Token](https://www.mapbox.com/help/define-access-token/) | - |
| timeout              | int               | Debounce between pressing the key and quering the results | 300 |
| viewport | object | [Map Viewport](https://uber.github.io/react-map-gl/#/documentation/api-reference/static-map?section=map-state) | - |
| onSelected | (required) function(viewport, item) | Receives selected item and the viewport to set for the selected [item](https://www.mapbox.com/api-documentation/?language=JavaScript#response-object) | - |
| transitionDuration | int | Duration of the smooth transition | 0 |
| hideOnSelect | bool | Whether to hide results on select or not | false |
| pointZoom | int | Zoom to set if a specific location (without bbox) is selected | 16 |
| formatItem | function(item) | Function used for formatting results | item => item.place_name |
| className | string | Class to add to the top component | - |
| queryParams | object | Query parameters to use when searching of the results, you can see available options [here](https://www.mapbox.com/api-documentation/?language=JavaScript#search-for-places) | - |
| limit | int | Limit of the results | 5 |
| localGeocoder | function(queryString) | Function to supplement local results to geocoder | - |

## Styling

This component does NOT come with any styles. You can style it yourself by using classes:

| Class name | Description |
| --- | --- |
| .react-geocoder | component wrapper class |
| .react-geocoder-results | results wrapper class |  
| .react-geocoder-item | single result class |

### Replacing components

You can even supplement your own components:

| Property name | Passed Properties | Properties description |
| --- | --- | --- |
| inputComponent | onChange | Function to call when the text changes |
| itemComponent | [item](https://www.mapbox.com/api-documentation/?language=JavaScript#response-object), onClick, children | children is item formatted to display | 

## License

MIT © [groinder](https://github.com/groinder)
