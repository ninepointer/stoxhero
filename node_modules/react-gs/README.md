# react-gs

<a href="https://www.npmjs.com/package/react-gs">
  <img src="https://img.shields.io/npm/v/react-gs.svg" alt="react-gs">
</a>
    
Inline style declarations for React

Demo - http://clintonhalpin.github.io/react-gs/examples/#/

# get started

Install
```
npm i react-gs --save
```

Import
```javascript
import * as gs from 'react-gs';

// JSX
<div style={gs.ta.center}>Text Align Center</div>
// Or with Radium ( object-assign )
<div style={[ga.ta.center, ga.fs.large]}>Text Align Center + Large</div>
```

built by [@clintonhalpin](http://clintonhalpin.com)
