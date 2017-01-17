import classNames from 'classnames';
import SidebarMixin from 'global/jsx/sidebar_component';

import Header from 'common/header';
import Sidebar from 'common/sidebar-music';
import Footer from 'common/footer';

class Body extends React.Component {
  render() {

    return (
      <Container id='body'>
        <div id="body-header">
          
          <div className="pull-right">
            <div className="btn-group">
              <button type="button" className="btn btn-default btn-hollow btn-lg btn-sq">Preview</button>
              <button type="button" className="btn btn-default btn-hollow btn-lg btn-sq dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span className="caret"></span>
                <span className="sr-only">Toggle Dropdown</span>
              </button>
              <ul className="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="#">Separated link</a></li>
              </ul>
            </div>
          </div>

          <h2>Untitled Project <span className="rubix-icon icon-outlined-pencil"></span></h2>

        </div>
        <div className="body-sidebar__container">
          
          <div className="row">
            <div className="col-md-10 col-md-offset-1">
              <div className="file-dropper tall">
                <span className="h3 mt0 mb0">No video artwork found. <span className="color-primary">Upload or Create it.</span></span>
              </div>
            </div>
          </div>

          <div className="body-sidebar__element pr5-imp pl5-imp">
            <h4 className="header">Project Info</h4>
            
            <ul className="list-unstyled">
              <li>Number of tracks: <span className="color-primary">Upload</span></li>
              <li>Metadata Completion: <span className="color-primary">80%</span></li>
              <li>Cover/Album Artwork: <span className="color-primary">No</span></li>
              <li>Video Artwork: <span className="color-primary">No</span></li>
              <li>Video Builds: <span className="color-primary">0</span></li>
              <li>Published: <span className="color-primary">0</span></li>
              <li>Project Size: <span className="color-primary">0MB</span></li>
            </ul>

            <div className="file-dropper">
              <span className="">No cover artwork found.<br /><span className="color-primary">Upload or Create it.</span></span>
            </div>
          </div>

        </div>
      </Container>
    );
  }
}

@SidebarMixin
export default class extends React.Component {
  render() {
    var classes = classNames({
      'container-open': this.props.open
    });

    return (
      <Container id='container' className={classes}>
        <Header />
        <Sidebar open="true" />
        <Body />
        <Footer />
      </Container>
    );
  }
}
