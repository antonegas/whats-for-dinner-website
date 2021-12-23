// Constants

// Variables
var activatedCookies = false;

class Dish {
  // Dish class
  constructor(name, weekdays, dates, freq, id) {
    this.name = name;
    this.weekdays = this.replaceWeekdays(weekdays);
    this.dates = dates;
    this.freq = freq;
    this.id = id;
  };

  get weekdaysStr() {
    // Returns str with active weekdays
    let weekdaysStr = "";
    let weekdaysArray = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    if (this.weekdays == 0) {
      return "all"
    };
    for (let i = 0; i < 7; i++) {
      if (this.weekdays[i] == true) {
        if (weekdaysStr.length == 0) {
          weekdaysStr += weekdaysArray[i];
        } else {
          weekdaysStr += ", " + weekdaysArray[i];
        };
      };
    };
    return weekdaysStr
  };

  replaceWeekdays(weekdays) {
    // Replaces a weekdays array with sure if all 7 indexes have the same value
    let equalsFirst = (day, index, arr) => {
      return day == arr[0];
    };
    if (weekdays === 0 || weekdays.every(equalsFirst)) {
      return 0
    } else {
      return weekdays
    };
  }
};

// REACT COMPONENTS
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfDishes: loadStoredDishes(),
      headerButtons: {
        first: {
          title: "Add dish",
          icon: "plus",
          onClick: () => console.log("plus"),
          visable: true
        },
        second: {
          title: "Switch to menu",
          icon: "utensils",
          onClick: () => this.updateHeaderButtons("Menu"),
          visable: true
        },
        third: {
          title: "Settings",
          icon: "cog",
          onClick: () => this.updateHeaderButtons("Settings"),
          visable: true
        }
      },
      content: "Dishes"
    };
  };

  updateLocalStorage() {
    // Updates locale storage to include current version of dishes
    if (JSON.parse(localStorage.getItem("activatedCookies")) === true) {
      localStorage.setItem("dishes", JSON.stringify(this.state.listOfDishes));
    };
  };

  updateHeaderButtons(content) {
    const back = this.state.content == "Dishes" ? "Dishes" : "Menu";
    const headerButtons = {
      Dishes: {
        first: {
          icon: "plus",
          onClick: () => console.log("plus"),
          visable: true
        },
        second: {
          icon: "utensils",
          onClick: () => this.updateHeaderButtons("Menu"),
          visable: true
        },
        third: {
          icon: "cog",
          onClick: () => this.updateHeaderButtons("Settings"),
          visable: true
        }
      },
      Menu: {
        first: {
          icon: "redo-alt",
          onClick: () => console.log("re-generate"),
          visable: true
        },
        second: {
          icon: "drumstick-bite",
          onClick: () => this.updateHeaderButtons("Dishes"),
          visable: true
        },
        third: {
          icon: "cog",
          onClick: () => this.updateHeaderButtons("Settings"),
          visable: true
        }
      },
      Settings: {
        first: {
          icon: "drumstick-bite",
          onClick: () => this.updateHeaderButtons("Dishes"),
          visable: false
        },
        second: {
          icon: "chevron-left",
          onClick: () => this.updateHeaderButtons(back),
          visable: true
        },
        third: {
          icon: "save",
          onClick: () => console.log("saved"),
          visable: true
        }
      }
    }

    this.setState({
      content: content,
      headerButtons: headerButtons[content]
    })
  }

  async addDish(name, weekdays, dates, freq) {
    // Creates a new Dish object with a unique ID (and saves it to cookies if enabled)
    let id;
    let notUnique = true;
    let newDishesObj = Object.assign({}, this.state.listOfDishes);

    do {
      id = generateID(4);
      if (!newDishesObj.hasOwnProperty(id)) {
        notUnique = false;
      };
    } while (notUnique);

    newDishesObj[id] = new Dish(id, weekdays.slice(0), dates, freq, id);
    await this.setState({listOfDishes: newDishesObj});
    this.updateLocalStorage();
  };

  async removeDish(id) {
    let newDishesObj = Object.assign({}, this.state.listOfDishes);
    if (newDishesObj.hasOwnProperty(id)) {
      delete newDishesObj[id];
    }
    await this.setState({listOfDishes: newDishesObj});
    this.updateLocalStorage();
  }

  render() {
    return (
      <React.StrictMode>
      <div id="wrapper">
        <Header first={this.state.headerButtons.first} second={this.state.headerButtons.second} third={this.state.headerButtons.third} />
        <section id="main">
          <div id="output-wrapper">
            <OutputHead text={this.state.content} />
            <div id="output-items">
              <DishesList onRemove={id => this.removeDish(id)} dishes={this.state.listOfDishes} />
            </div>
            <button onClick={() => {this.addDish("test", [false, false, false, false, false, false, false], null, 7)}}>Click me!</button>
          </div>
        </section>
      </div>
      </React.StrictMode>
    )
  }
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeButtons: ["add", "change", "settings"],
    };
  };

  render() {
    return (
      <header>
        <a href="../index.html" id="logo">
          <figure>
            <img src="../assets/logo.png" alt="logo" />
          </figure>
        </a>
        <HeaderButton icon={this.props.first.icon} title={this.props.first.title} onClick={() => this.props.first.onClick()} visable={this.props.first.visable} />
        <HeaderButton icon={this.props.second.icon} title={this.props.second.title} onClick={() => this.props.second.onClick()} visable={this.props.second.visable} />
        <HeaderButton icon={this.props.third.icon} title={this.props.third.title} onClick={() => this.props.third.onClick()} visable={this.props.third.visable} />
      </header>
    );
  };
}

function HeaderButton(props) {
  let styling;
  if (props.visable) {
    styling = "green threed-button";
  } else {
    styling = "green threed-button no-show"
  }

  return (
    <div className="header-button-wrapper">
      <button title={props.title} alt={props.title} className={styling} onClick={() => props.onClick()}>
        <figure><i className={'fas fa-' + props.icon}></i></figure>
      </button>
    </div>
  );
}

function OutputHead(props) {
  return (
    <h1 id="output-head">{props.text}</h1>
  )
}

class DishItem extends React.Component {
  // dish-output-item react component
  // TODO: see other button (setAttribute) when it's time
  // NOTE: remove should be an option after edit has been initialized
  state = {
    collapsed: true,
  }

  render() {
    return (
      <div className={'output-item dish-output-item ' + (this.props.collapsed ? 'collapsed' : 'not-collapsed')}>
        <div className="preview">
          <div className="title">
            <p>{this.props.name}</p>
          </div>
          <div className="collapse-button-wrapper">
            <button className="collapse" onClick={() => this.props.onCollapse(this.props.dishID)}>
              <i className={'fas fa-chevron-' + (this.props.collapsed ? 'down' : 'up')}></i>
            </button>
          </div>
        </div>
        <div className="output-footer">
          <div className="output-info">
            <p>{'Frequency: ' + (this.props.freq)}</p>
            <p>{'Weekdays: ' + (this.props.weekdaysStr)}</p>
          </div>
          <div className="output-button-wrapper">
            <button className="red threed-button" onClick={() => this.props.onRemove(this.props.dishID)}>Remove</button>
          </div>
        </div>
      </div>
    )
  }
}

class DishesList extends React.Component {
  // Unordered list of all dishes used when loadDishes is called
  constructor(props) {
    super(props);
    this.state = {
      collapsedID: null,
    }
  }

  handleCollapse(id) {
    if (this.state.collapsedID == id) {
      this.setState({collapsedID: null});
    } else {
      this.setState({collapsedID: id});
    }
  }

  render() {
    const dishes = Array();
    let currentDish = null;
    for (let key in this.props.dishes) {
      currentDish = this.props.dishes[key]
      // console.log(key)
      dishes.push(
        <DishItem
          name={currentDish.name}
          freq={currentDish.freq}
          weekdaysStr={currentDish.weekdaysStr}
          dishID={currentDish.id}
          key={key}
          onRemove={id => this.props.onRemove(id)}
          collapsed={!(this.state.collapsedID == currentDish.id)}
          onCollapse={id => this.handleCollapse(id)}
        />
      )
    }
    return (
      <ul>{dishes.reverse()}</ul>
    )
  }
}

function MenuItem(props) {
  return (
    <div className={'output-item menu-output-item'}>
      <div className="preview">
        <div className="title">
          <p>{props.name}</p>
        </div>
        <div className="menu-day">
          <p className="weekday">{props.weekday}</p>
          <p className="date">{`${props.day} ${props.month}`}</p>
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

// End of React components

function consentToCookies(consented) {
  // Updates local storage if consent changes
  let activated = JSON.parse(localStorage.getItem("activatedCookies"));
  if (consented === true && activated != true) {
    updateLocalStorage();
    localStorage.setItem("activatedCookies", "true");
  } else if (consented === false && activated != false) {
    localStorage.removeItem("dishes");
    localStorage.setItem("activatedCookies", "false");
  };
};

function loadStoredDishes() {
  let storedDishes = null;
  let loadedDishes = Object();
  if (JSON.parse(localStorage.getItem('activatedCookies'))) {
    storedDishes = JSON.parse(localStorage.getItem('dishes'));
  };
  if (storedDishes) {
    for (let key in storedDishes) {
      loadedDishes[key] = dishFromObject(storedDishes[key])
    };
  };
  return loadedDishes;
}

function dishFromObject(obj) {
  // Converts a dish-like object into a dish
  // Used when loading dishes from local storage
  return new Dish(obj.name, obj.weekdays, obj.dates, obj.freq, obj.id);
}

function generateID(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// TODO: Ask about cookies.
// TODO: Edit dish function.
// TODO: Generate menu function
/* NOTE: Generate menu function should be entirely based on dishes and
their data in menu Array. So that data from it can be shared between devices. */