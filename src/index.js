import { renderDom, Component, el, tn } from './Lve/index';


const root = document.getElementById('root');


class App extends Component {


  state = {
    text: 'hello',
    hello: false,
    color: 'red',
  };

  onClick = (e) => {
    this.setState({
      text: 'hello world',
      hello: true,
    })
  };

  changeColor = () => {
    this.setState({
      color: 'blue'
    });
  };


  render() {

    const button = el('button', {
      'onClick': this.onClick
    }, [
      tn(this.state.text)
    ]);

    const button2 = el('button', {
      'style': `background: ${this.state.color}`,
      'onClick': this.changeColor
    }, [
      tn(this.state.text + 'Lve')
    ]);


    return el('div', {}, [
      el('p', {}, [
        tn(this.state.text),
      ]),
      button,
      this.state.hello ? button2 : null,
    ]);
  }

}


renderDom(new App(), root);

