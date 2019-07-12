import React from 'react';
import './index.css';

class PropertyList extends React.Component{
	constructor(props) {
        super(props);
        this.state = {
           totalCount: 0,
           data: [],
           dataDeepCopy: [],
           activeView: 'listView',
           minRent: 0,
           maxRent: 0,
           minSize: 0,
           maxSize: 0,
           popupVisible: false,
           filterPopup: true,
           width: window.innerWidth,
           shortlisted: []
        };
        this.handleSort = this.handleSort.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.filterContentPrice = this.filterContentPrice.bind(this)
    }

    componentWillMount() {
	  window.addEventListener('resize', this.handleWindowSizeChange);
	}
    componentDidMount() {
    	fetch("https://demo8808386.mockable.io/fetchProperties")
		.then(res => res.json())
		.then(
			(result) => {
				console.log(result.data)
			  	this.setState({ data: result.data})
				var dataCopy = JSON.parse(JSON.stringify(this.state.data));
				var totalCount = this.state.data.length
				this.setState({totalCount: totalCount})
				this.setState({dataDeepCopy: dataCopy})
				this.findMinMax(this.state.data);
			},
			(error) => {
			 
			}
		)
		this.togglePopup(false)
    }

    componentWillUnmount() {
	  window.removeEventListener('resize', this.handleWindowSizeChange);
	}

	handleWindowSizeChange = () => {
	  this.setState({ width: window.innerWidth });
	};

    changeView(e){
		var element = e.target;
		if(element.classList.contains('gridView')){
			this.setState({activeView: 'gridView'});
		}else{
			this.setState({activeView: 'listView'});
	    }
	}

    handleChange(e) {
	    var element = e.target;
	    if(element.name == "rent"){
		    this.setState({minRent: element.value});
		    console.log(this.state.minRent)
		    this.filterContentPrice(this.state.minRent)
		}else{
			this.setState({minSize: element.value});
			this.filterContentSize(this.state.minSize)
		}
	}

	filterContentPrice(value){
		const dataCopy = this.state.dataDeepCopy
	    const filteredData = dataCopy.filter((item) => 
	    	item.rent > value);
	    this.setState({data: filteredData})
	}

	filterContentSize(value){
		const dataCopy = this.state.dataDeepCopy
	    const filteredData = dataCopy.filter((item) => 
	    	item.propertySize > value);
	    this.setState({data: filteredData})
	}

	findMinMax(dataList){
		var lowestRent = Number.POSITIVE_INFINITY;
		var highestRent = Number.NEGATIVE_INFINITY;
		var minSize = Number.POSITIVE_INFINITY;
		var maxSize = Number.NEGATIVE_INFINITY;
		var tmp;
		for (let i= dataList.length-1; i>=0; i--) {
		    tmp = dataList[i].rent;
		    if (tmp < lowestRent) lowestRent = tmp;
		    if (tmp > highestRent) highestRent = tmp;
		}
		this.setState({minRent: lowestRent})
		this.setState({maxRent: highestRent})

		for (let i= dataList.length-1; i>=0; i--) {
		    tmp = dataList[i].propertySize;
		    if (tmp < minSize) minSize = tmp;
		    if (tmp > maxSize) maxSize = tmp;
		}
		this.setState({minSize: minSize})
		this.setState({maxSize: maxSize})
	}

	capitalize(str){
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

    shortlistProperty(e,value){
    	console.log("+++++++++"+value)
    	var element = e.target
    	var dataList = this.state.data
    	console.log(dataList[value])
    	this.setState({shortlisted: this.state.data[value]})
    	console.log(this.state.shortlisted)
    }


    renderPropertyList(items){
   		var propertyListItem = items.map((item, i) => {
	      return (
	        <div key={i} className={this.state.activeView == 'listView' ? 'propertyListItem' : 'propertyGridItem'}>
	        	{this.state.activeView == "listView" ?
		        	<div className="itemBlock">
		        		<div className="itemImage">
		        			{item.photos.length ? this.showImages(item.photos) : <img src="https://images.nobroker.in/static/img/resale/1bhk.jpg"/>}
		        			<div className="price">&#8377; {item.rent} /-</div>
		        		</div>
		        		<div className="itemDescription">
		        			<p className="itemTitle truncate">{item.propertyTitle}</p>
		        			<p className="truncate"><span></span><span className="itemStreet">{item.street}</span><span className="dotSeperator"> . </span><span className="itemLocality"> {item.locality}</span></p>
		        			<p className="itemInfo"> {item.propertySize}  sq.ft |  Built {item.propertyAge == 0 ? 'this year' : item.propertyAge+' years ago'} | {item.floor == 0 ? 'Ground': item.floor } floor | {this.capitalize(item.furnishing)} {item.leaseType == 'FAMILY'? " | Family only":''}</p>
		        			<p>&#8377; {item.deposit} Deposit</p>
		        			<p>Posted on {this.getDate(item.creationDate)}</p>
		        			<p>Available from {this.getDate(item.availableFrom)}</p>
		        			<p className="lastUpdateDate">Last updated on {this.getDate(item.lastUpdateDate)}</p>
		        		</div>
		        		<div className="listItemShortlist pointer">
		        			<p className="shortListImage" onClick={this.shortlistProperty.bind(this,i)}></p>
		        		</div>
		        	</div>
					:
		        	<div className="gridItemBlock">
		        		<div className="itemImage">
		        			{item.photos.length ? this.showImages(item.photos) : <img src="https://images.nobroker.in/static/img/resale/1bhk.jpg" />}
		        			<div className="price">&#8377; {item.rent} /-</div>
		        		</div>
		        		<div className="itemDescription">
		        			<p className="itemTitle truncate">{item.propertyTitle}</p>
		        			<p className="truncate"><span className=""></span><span className="itemStreet">{item.street}</span><span className="dotSeperator"> . </span><span className="itemLocality"> {item.locality}</span></p>
		        			<p> {item.propertySize}  sq.ft | {item.floor == 0 ? 'Ground': item.floor } floor</p>
		        			<p>&#8377; {item.deposit} Deposit</p>
		        			{item.amenitiesMap.length ? <p>Amenities : {this.renderAmenities(item.amenitiesMap)}</p>: ''}
			        		<p className="lastUpdateDate">Last updated on {this.getDate(item.lastUpdateDate)}</p>
		        		</div>
		        		<div className="shortListBlock pointer">
		        			<p className="shortListImage" onClick={this.shortlistProperty.bind(this,i)}></p>
		        		</div>
		        	</div>
		        }
	        </div>
	      );
	    });
    	return propertyListItem;
    }

    renderAmenities(amenitieItem){
    	var amenitieList = Object.keys(amenitieItem).map(function(keyName, keyIndex) {
    	 return (
	    	<span key={keyName} className="">
	    		{amenitieItem[keyName] ? keyName+', ' : ''}
			</span>
		  );
		});
		return amenitieList;
	}

    getDate(date){
		 var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		 var date = new Date(date);
		 var year = date.getFullYear();
		 var month = months_arr[date.getMonth()];
		 var day = date.getDate();
		 var updateDate = month+'-'+day+'-'+year;
		 return updateDate
	}

	showImages(images){
		var propertyImage;
		images.map((item, i) => {
			propertyImage = Object.keys(item.imagesMap).map(function(keyName, keyIndex) {
				if(keyName == 'medium'){
				 	var url = item.imagesMap[keyName]
					var imagePath = item.imagesMap[keyName].split('_')
					return (
				    	<img  key={keyName} src={"https://assets.nobroker.in/images/"+imagePath[0]+"/"+url} />
					);
				}
			});
		})
		return propertyImage;
	}

	handleSort(e){
		var element = e.target;
		var value = e.target.value
		var dataCopy = this.state.data
		if(value == "priceLowToHigh"){
			let sortedData = dataCopy.sort((a, b) => a.rent - b.rent)
			this.setState({ data: sortedData})
		}else if(value == "priceHighToLow"){
			let sortedData = dataCopy.sort((a, b) => a.rent - b.rent).reverse()
			this.setState({ data: sortedData})
		}else if(value == "Newest"){
			let sortedData = dataCopy.sort((a, b) =>  a.propertyAge - b.propertyAge)
			this.setState({ data: sortedData })
		}else if(value == "creationDate"){
			let sortedData = dataCopy.sort((a, b) =>  a.creationDate - b.creationDate).reverse()
			this.setState({ data: sortedData })
		}
	}

	togglePopup(value){
		const { width } = this.state;
		const isMobile = width <= 500;
		if(isMobile){
			this.setState({filterPopup: value})
		}
	}

	render(){
		  const { width } = this.state;
  		 const isMobile = width <= 500;
		return (
			<div className="background">
				<header className="header">
					<div className="displayFlexHeader">
						<p className="headerName">SHELTER</p>
						<p className="loginInfo">
							<span className="mr-20 pointer">Piyush Kumar</span>
							<span className="pointer">Log out</span>
						</p>
					</div>
				</header>
				<div className="mainContent">
					{this.state.filterPopup == true &&
						<div className="fixedLeft">
							<span className="floatRight pointer smallOnly" onClick={this.togglePopup.bind(this,false)}>X</span>
							<p className="paddingTB16 bold">Filter</p>
							<div className="filterBlock">
								<div className="borderInBox">
									<div className="slidecontainer">
										<p className="filterTitle">Rent: {this.state.currentRent}<span id="demo"></span></p>
										<input type="range" min="0" max={this.state.maxRent} value={this.state.minRent} name="rent" className="slider" onChange={this.handleChange.bind(this)} step="100"/>
										<p className="filterInfo"><span>&#8377; {this.state.minRent}</span><span>&#8377; {this.state.maxRent}</span></p>
									</div>
									<div className="slidecontainer">
										<p className="filterTitle">Property Size: {this.state.currentSize}<span id="demo"></span></p>
										<input type="range" min="0" max={this.state.maxSize} value={this.state.minSize} name="size" className="slider" step="100" onChange={this.handleChange.bind(this)} />
										<p className="filterInfo"><span>{this.state.minSize} sq.ft</span><span>{this.state.maxSize} sq.ft</span></p>
									</div>
								</div>
							</div>
							<p className="paddingTB16 bold">Sort</p>
							<div className="filterBlock">
								<div className="borderInBox">
									<p className="clear-fix">
										<label className="lablDiv greenRadioContainer alignRadioLeft display-IB">           
										    <span className="labelText"> Price(Low to High) </span>
										        <input type="radio" className="dis-none" value="priceLowToHigh" name="sort" onClick={this.handleSort.bind(this)} />         
										    <span className="floatLeft mt-1"></span>
										</label>
									</p>
									<p className="clear-fix">
										<label className="lablDiv greenRadioContainer alignRadioLeft display-IB">           
										    <span className="labelText"> Price(High to Low) </span>
										        <input type="radio" className="dis-none" value="priceHighToLow" name="sort" onClick={this.handleSort.bind(this)}/>         
										    <span className="floatLeft mt-1"></span>
										</label>
									</p>
									<p className="clear-fix">
										<label className="lablDiv greenRadioContainer alignRadioLeft display-IB">           
										    <span className="labelText"> Creation Date </span>
										        <input type="radio" className="dis-none" value="creationDate" name="sort" onClick={this.handleSort.bind(this)}/>         
										    <span className="floatLeft mt-1"></span>
										</label>
									</p>
									<p className="clear-fix">
										<label className="lablDiv greenRadioContainer alignRadioLeft display-IB">           
										    <span className="labelText"> Property Age </span>
										        <input type="radio" className="dis-none" value="Newest" name="sort" onClick={this.handleSort.bind(this)}/>         
										    <span className="floatLeft mt-1"></span>
										</label>
									</p>
								</div>
							</div>
						</div>
					}
					<div className="rightBlock">
						<div className="paddingTB10 viewHolder">
							<p className="smallOnly mobileFilter pointer" onClick={this.togglePopup.bind(this,true)}>Filter</p>
							<p className="smallOnly mobileFilter mr-12 pointer" onClick={this.togglePopup.bind(this,true)}>Sort</p>
							<p className={"listView pointer" + (this.state.activeView == 'gridView' ? " opacity" :'')} onClick={this.changeView.bind(this)}></p>
							<p className={"gridView pointer" + (this.state.activeView == 'listView' ? " opacity" :'')} onClick={this.changeView.bind(this)}></p>
						</div>
						<div className={this.state.activeView == 'listView' ? 'propertyList' : 'propertyGrid'}>
							{this.renderPropertyList(this.state.data)}
						</div>
					</div>
				</div>
				<footer>
				</footer>
			</div>
		);
	}
}

export default PropertyList;