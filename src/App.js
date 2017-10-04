import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './App.css';
import icon from './img/wizard-hat-icon.png';
import splashImg from './img/splash.png';
import startHelperImg from './img/start-helper.png';

// Utility Component for animating in single elements
// @see https://reactjs.org/docs/animation.html
function FirstChild(props) {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
}

const MENU_ITEMS = [
	{ 
		id: '1',
		text: 'Abjuration',
		isActive: false
	},
	{ 
		id: '2',
		text: 'Conjuration',
		isActive: false,
		items: [
			{ 
				id: '2-1', 
				text: 'Summon an overripe banana',
				isActive: false
			},
			{ 
				id: '2-2',
				text: 'Conjure a beach ball of doom',
				isActive: false,
				items: [
					{ 
						id: '2-2-1', 
						text:'Or a postcard of doom',
						isActive: false
					},
					{ 
						id: '2-2-2',
						text:'Or really any kind of doom you want!',
						isActive: false
					},
				]
			},
			{ 
				id: '2-3',
				text: 'Lure an angry squirrel to your location',
				isActive: false
			},
		],
	},
	{ 
		id: '3',
		text: 'Enchantment',
		isActive: false
	},
	{ 
		id: '4',
		text: 'Evocation',
		isActive: false
	},
	{ 
		id: '5',
		text: 'Divination',
		isActive: false,
		items: [
			{ 
				id: '5-1', 
				text: 'Discern the location of an item',
				isActive: false,
				items: [
					{ 
						id: '5-1-1',
						text:'a single flip flop',
						isActive: false
					},
					{ 
						id: '5-1-2', 
						text:'a firewire cable',
						isActive: false
					},
					{ 
						id: '5-1-3', 
						text:'a yogurt lid',
						isActive: false
					},
				]
			},
			{ 
				id: '5-2',
				text: 'See 1 minute into your past',
				isActive: false
			},
			{ 
				id: '5-3',
				text: 'Unravel the mystery of how chocolate can be both good and bad for you at the same time',
				isActive: false
			}
		],
	},
	{ 
		id: '6',
		text: 'Transmutation',
		isActive: false
	},
	{ 
		id: '7',
		text: 'Illusion',
		isActive: false,
		items: [
			{ 
				id: '7-1', 
				text: 'Make a dirty dish look clean while still being dirty',
				isActive: false
			},
			{ 
				id: '7-2', 
				text: 'Make your phone appear more scratched than it already is',
				isActive: false
			}
		],

	}
];

/**
 * The container component for the app. Handles the hiding and showing of
 * the app's various menus
 */
class App extends Component {

	constructor() {
		super();
		this.state = {
			menuOpen: false
		};
	}

	handleNavClick() {
		this.setState({menuOpen: !this.state.menuOpen});
	}

	render() {
		return (
			<div className="app-container">
				<NavBar 
					isActive={this.state.menuOpen} 
					clickHandler={this.handleNavClick.bind(this)} 
				/>
				<div className="main-content-wrap">
					<div className="splash-wrap">
						<img className="splash-instruction-img" src={startHelperImg} width="150" height="52" alt="Start by clicking the menu button."/>
						<img className="splash-main-img" src={splashImg} width="255" height="240" alt="Welcome to the App of Disappointing Magic"/>
					</div>
					<ReactCSSTransitionGroup
					  component={FirstChild}
					  transitionName="lvl-1-menu"
					  transitionEnterTimeout={300}
					  transitionLeaveTimeout={200}
					 >
						{this.state.menuOpen ? 
							<Menu 
								isActive={this.state.menuOpen} 
								level={1} 
								items={MENU_ITEMS}
								title="Welcome Traveler!"
								description="Browse our collection of unique Magicks below. We think you'll find them quite disappointing!" 
							/> 
						: null}
					</ReactCSSTransitionGroup>
				</div>
			</div>
		);
	}
}


/**
 * The NavBar at the top that houses the menu open/close button
 */
class NavBar extends Component {

	render() {
		let buttonActiveClass = this.props.isActive ? 'is-active' : '';
		return (
			<nav className={'nav-bar'}>
				<img className='nav-bar-icon' src={icon} width="65" height="25" alt="Wizard Hat Icon" />
				<button aria-label="menu" onClick={this.props.clickHandler} className={"hamburger hamburger--spin " + buttonActiveClass} type="button">
					<span className="hamburger-box">
					<span className="hamburger-inner"></span>
					</span>
				</button>
			</nav>
		);
	}
}

NavBar.propTypes = {
  isActive: PropTypes.bool.isRequired, // Is the Main Menu Open?
  clickHandler: PropTypes.func.isRequired // Handles click on the menu button
};


/**
 * A Container for MenuItems with significant rendering differences
 * based on the property 'level' which indicates how nested a menu is.
 */
class Menu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: props.items
		}
	}

	handleItemClick(evt, item) {
		let newItems = JSON.parse(JSON.stringify(this.state.items));
		let newItem = newItems.find(newItem => newItem.id === item.id);
		newItem.isActive = !newItem.isActive;
		this.setState({items: newItems});
		evt.stopPropagation(); // Prevents event from bubbling up to parent items
	}

	render() {
		let activeClass = this.props.isActive ? 'active' : '';
		let menuItems = this.state.items.map(item => {
			return (
				<MenuItem 
					key={item.id} 
					text={item.text} 
					items={item.items} 
					level={this.props.level}
					isActive={item.isActive}
					clickHandler={(evt) => this.handleItemClick(evt, item)}
				/>
			);
		});
		return (
			<menu className={activeClass + ' menu lvl-' + this.props.level}>
				{ (this.props.title && this.props.level < 3) ?
					<div className="menu-title-wrap">
						
						<h1 className="menu-title">
							{this.props.title}
						</h1>

						{ this.props.description ? 
							<p className="menu-description">
								{ this.props.description }
							</p>
						: null }

						{ this.props.level === 2 ?
							<div className="menu-close-wrap">
								<button 
									className="menu-close" 
									onClick={this.props.itemClickHandler}
									type="button"
									aria-label="Close"
								>
								</button>
							</div>
						: null }
					</div>
				: null }
				<ul className="item-list">{menuItems}</ul>
			</menu>
		);
	}
}

Menu.propTypes = {
	isActive: PropTypes.bool.isRequired, // Is this menu open?
	level: PropTypes.number.isRequired, // How nested is this menu? Starts at 1
	items: PropTypes.array.isRequired, // The items that make up the menu
	title: PropTypes.string, // The menu's title
	description: PropTypes.string, // A description of the menu
	itemClickHandler: PropTypes.func // Handles the activating/deactivating of items
};


/**
 * An item in a Menu. May contain nested Menus.
 */
class MenuItem extends Component {
	render() {
		let activeClass = this.props.isActive ? 'active' : '';

		return (
			<li className={'item lvl-' + this.props.level + ' ' + activeClass}>
				<div className="item-content-wrap">
					<div className="item-text">{this.props.text}</div>  
					{ this.props.items ? 
						<button 
							className={"submenu-button " + activeClass} 
							onClick={this.props.clickHandler}
							type="button"
							aria-label="Open Sub-Menu"
						>
						</button>
					: null}
				</div> 
				
				<ReactCSSTransitionGroup
					component={FirstChild}
					transitionName={"lvl-"+(this.props.level + 1) + "-menu"}
					transitionEnterTimeout={300}
					transitionLeaveTimeout={200}
				>
					{ (this.props.items && this.props.isActive) ?
						<div className="submenu-wrap">
							{ this.props.level === 1 ? 
								<button 
									className="menu-close-invisible" 
									onClick={this.props.clickHandler}
									type="button"
									aria-label="Close"
								>
								</button>
							: null }
							<Menu 
								level={this.props.level + 1}
								items={this.props.items} 
								title={this.props.text}
								isActive={this.props.isActive}
								itemClickHandler={this.props.clickHandler}
							/>
						</div>
					: null}
				</ReactCSSTransitionGroup>
			</li>
		);
	}
}

MenuItem.propTypes = {
	isActive: PropTypes.bool.isRequired, // Is this item activated?
	level: PropTypes.number.isRequired, // How deeply nested is this item? Starts at 1.
	items: PropTypes.array, // Items in the sub-menu of this item
	text: PropTypes.string.isRequired, // The text content of an item
	clickHandler: PropTypes.func.isRequired // Handles the activating/deactivating of the Item
};

export default App;