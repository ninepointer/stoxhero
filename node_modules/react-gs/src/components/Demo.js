import React from 'react';
import Radium from 'radium';
import * as gs from './../../lib/';
import { Link } from 'react-router';

console.log(gs)

@Radium
export default class Demo extends React.Component {
  render () {
    return (
        <div style={[gs.ff.sanSerif, gs.p._b4]}>
            <div style={[gs.m._b2]}>
                <h1 style={[gs.fs.xxLarge, gs.fw.normal]}># react-gs</h1>
                <p>Get started with react-gs by running <span style={gs.ff.monospace}>npm install react-gs --save</span></p>
            </div>
            <div style={[gs.m._b2]}>
                <h1 style={[gs.fs.large, gs.fw.normal]}># ta: Text Align</h1>
                <div>left</div>
                <div>center</div>
                <div>right</div>
                <hr style={gs.m._t2}/>
            </div>
            <div style={[gs.m._b2]}>
                <h1 style={[gs.fs.large, gs.fw.normal]}># p: Position</h1>
                <div>relative</div>
                <div>static</div>
                <div>absolute</div>
                <div>fixed</div>
                <hr style={gs.m._t2}/>
            </div>
            <div style={[gs.m._b2]}>
                <h1 style={[gs.fs.large, gs.fw.normal]}># d: Display</h1>
                <div>none</div>
                <div>inline</div>
                <div>block</div>
                <div>inlineBlock</div>
                <div>inlineTable</div>
                <div>table</div>
                <div>tableCell</div>
                <div>tableColumn</div>
                <div>tableColumnGroup</div>
                <div>flex</div>
                <hr style={gs.m._t2}/>
            </div>
            <div style={[gs.m._b2]}>
                <h1 style={[gs.fs.large, gs.fw.normal]}># fw: Font Weight</h1>
                <div>lighter</div>
                <div>normal</div>
                <div>bold</div>
                <div>bolder</div>
            </div>
            <div style={[gs.m._b2]}>
                <h1 style={[gs.fs.large, gs.fw.normal]}># m, p: Margin, Padding</h1>
                <div>gs.[m,p]._0</div>
                <div>gs.[m,p]._t0</div>
                <div>gs.[m,p]._r0</div>
                <div>gs.[m,p]._b0</div>
                <div>gs.[m,p]._l0</div>
                <div>gs.[m,p]._1</div>
                <div>gs.[m,p]._t1</div>
                <div>gs.[m,p]._r1</div>
                <div>gs.[m,p]._b1</div>
                <div>gs.[m,p]._l1</div>
                <div>gs.[m,p]._2</div>
                <div>gs.[m,p]._t2</div>
                <div>gs.[m,p]._r2</div>
                <div>gs.[m,p]._b2</div>
                <div>gs.[m,p]._l2</div>
                <div>gs.[m,p]._3</div>
                <div>gs.[m,p]._t3</div>
                <div>gs.[m,p]._r3</div>
                <div>gs.[m,p]._b3</div>
                <div>gs.[m,p]._l3</div>
                <div>gs.[m,p]._4</div>
                <div>gs.[m,p]._t4</div>
                <div>gs.[m,p]._r4</div>
                <div>gs.[m,p]._b4</div>
                <div>gs.[m,p]._l4</div>
                <div>gs.[m,p]._xn1</div>
                <div>gs.[m,p]._xn2</div>
                <div>gs.[m,p]._xn3</div>
                <div>gs.[m,p]._xn4</div>
                <div>gs.[m,p]._xauto</div>
                <hr style={gs.m._t2}/>
            </div>
            <div style={[gs.m._b2]}>
                <h1 style={[gs.fs.large, gs.fw.normal]}># ff: Font Family</h1>
                <div style={gs.ff.sanSerif}>sanSerif</div>
                <div style={gs.ff.monospace}>monospace</div>
                <hr style={gs.m._t2}/>
            </div>
            <div style={[gs.m._b2]}>
                <h1 style={[gs.fs.large, gs.fw.normal]}># fs: Font Size</h1>
                <div>xxLarge</div>
                <div>xLarge</div>
                <div>large</div>
                <div>medium</div>
                <div>small</div>
                <div>xSmall</div>
                <hr style={gs.m._t2}/>
            </div>
            <h1 style={[gs.fs.xxLarge, gs.fw.normal]}># Modules</h1>
            <h1 style={[gs.fs.large, gs.fw.normal]}># textTruncate</h1>
            <div style={gs.modules.textTruncate}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at lectus nec sem aliquam finibus sed imperdiet erat. Aliquam erat volutpat. Vivamus non condimentum tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas non ipsum enim. Cras vitae ex eros. Suspendisse potenti. Sed nec egestas sem. Duis nibh nulla, sollicitudin hendrerit ornare sed, auctor non arcu. Nam in magna faucibus, dignissim odio sed, auctor velit. Suspendisse fermentum, odio quis consectetur egestas, orci urna aliquam diam, sit amet cursus urna enim et dolor. Donec vitae magna odio. Mauris egestas erat ut ipsum laoreet dapibus. Quisque vel dui vehicula turpis consectetur pulvinar eget sit amet ipsum. Nullam consectetur ac justo non blandit. Praesent orci enim, euismod sit amet odio a, ullamcorper mollis mi. Quisque a varius eros, ut lacinia erat. Phasellus malesuada tempor porta. Sed eget consequat urna. Etiam eu nibh nunc. Praesent dictum nisl a tortor malesuada suscipit. Quisque in libero ullamcorper, eleifend nunc vitae, sodales lectus. Mauris dignissim augue quis quam placerat suscipit. Maecenas efficitur orci risus, sit amet viverra augue semper nec. Sed porttitor felis non luctus tristique. Curabitur pharetra eget orci quis pulvinar. Proin tempus eros eget commodo eleifend. Phasellus nunc dui, tempus sed bibendum vitae, vehicula eu tellus. Nulla ac lorem arcu. Suspendisse fermentum erat ligula, sit amet congue purus suscipit at. Phasellus ultrices erat vel metus lacinia, at commodo nunc lacinia. Sed rutrum pharetra neque. Quisque congue egestas nisi, sed facilisis sapien tempus posuere. Duis vel congue nisl. Cras ac turpis ut quam imperdiet luctus. Phasellus vehicula augue sed justo pharetra, ac lacinia augue molestie. Phasellus tortor mauris, feugiat quis cursus eget, blandit vitae sem. Nullam nec nibh ullamcorper quam finibus dictum quis nec sem. Aenean ut ex at dolor bibendum congue quis vitae velit. Pellentesque eu vulputate dolor. Nunc non purus ut sapien porta finibus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse quis diam sed mauris tincidunt iaculis. Morbi a purus et augue tempus varius id vitae lectus. Nulla a elementum quam. Praesent imperdiet felis et lacus tincidunt, a gravida leo aliquam. Sed pellentesque orci non finibus hendrerit. Sed efficitur lacus in purus elementum, nec consectetur erat ullamcorper. Morbi at tortor vestibulum, malesuada ante vel, aliquet neque. In scelerisque, nisi sed malesuada sollicitudin, orci eros mollis turpis, bibendum rhoncus ligula urna at purus. Quisque eu risus quis metus varius mollis eget at magna. Cras semper quis mauris ac mollis. Integer id justo sem. Cras ut turpis tortor. Suspendisse semper arcu eget mauris iaculis imperdiet.</div>
            <h1 style={[gs.fs.large, gs.fw.normal]}># flag</h1>
            <div style={gs.modules.flag}>
                <div style={gs.modules.flag.image}>Image</div>
                <div style={gs.modules.flag.body}>Flag Body</div>
            </div>
        </div>
    )
  }
}
