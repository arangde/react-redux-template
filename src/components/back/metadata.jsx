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
            (Unsaved changes)
            <div className="btn-group">
              <button type="button" className="btn btn-default btn-hollow btn-lg btn-sq">Save</button>
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

          <h2>ANTI Album <span className="rubix-icon icon-outlined-pencil"></span></h2>

        </div>
        <div className="body-sidebar__container">
          
          <div className="row">
            <div className="col-sm-12">
              <h3 className="header">
                <span className="rubix-icon pull-right icon-simple-line-icons-settings"></span>
                <span className="rubix-icon icon-flatline-minus"></span>
                <span className="ml2 mr2">Metadata</span>
                <span className="rubix-icon icon-simple-line-icons-question"></span>
              </h3>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <p><span className="rubix-icon icon-fontello-asterisk"></span> = required field</p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="form-control" />
                <p>Exactly how you'd like it to appear</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Artist</label>
                <select className="form-control"></select>
                <p>It is very important to make sure you write this exactly as it needs to be or you ain't gettin' paid, bro.</p>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Album</label>
                <input type="text" className="form-control" />
                <p>Exactly how you'd like it to appear</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Album Artist</label>
                <select className="form-control"></select>
                <p>It is very important to make sure you write this exactly as it needs to be or you ain't gettin' paid, bro.</p>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-md-2">
              <div className="form-group">
                <label>Year</label>
                <input type="text" className="form-control" value="2016" />
              </div>
            </div>
            <div className="col-md-3">

              <div className="form-group">
                <label>Track</label>
                <div className="input-group">
                  <input type="text" className="form-control" value="10" />
                  <span className="input-group-addon" id="sizing-addon1">of</span>
                  <input type="text" className="form-control" value="12" />
                </div>
              </div>

            </div>
            <div className="col-md-3">

              <div className="form-group">
                <label>Disc</label>
                <div className="input-group">
                  <input type="text" className="form-control" value="1" />
                  <span className="input-group-addon" id="sizing-addon1">of</span>
                  <input type="text" className="form-control" value="1" />
                </div>
              </div>

            </div>
            <div className="col-md-1">
              <div className="form-group">
                <label>BPM</label>
                <input type="text" className="form-control" value="128" />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label>BPM</label>
                <select className="form-control" value="128"></select>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-10">
              <div className="form-group">
                <label>Featured Artist</label>
                <input type="text" className="form-control" value="" />
                <p>Separate each artist or band with a comma</p>
              </div>
            </div>
          </div>

          <div className="row mt6">
            <div className="col-md-4">
              <div className="form-group">
                <label>Composer</label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Publisher</label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Performing Right Organization</label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <input type="text" className="form-control" value="" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <select className="form-control" value="128"></select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <div className="input-group">
                  <select className="form-control" value="128"></select>
                  <span className="input-group-addon" id="sizing-addon1">
                    <a href="#" className="btn muted btn-link btn-lg pr0-imp pl0-imp pt0-imp pb0-imp"><span className="rubix-icon icon-feather-circle-minus"></span></a>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <input type="text" className="form-control" value="" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <select className="form-control" value="128"></select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <div className="input-group">
                  <select className="form-control" value="128"></select>
                  <span className="input-group-addon" id="sizing-addon1">
                    <a href="#" className="btn muted btn-link btn-lg pr0-imp pl0-imp pt0-imp pb0-imp"><span className="rubix-icon icon-feather-circle-plus"></span></a>
                  </span>
                </div>
              </div>
            </div>
          </div>


          <div className="row mt6">
            <div className="col-md-4">
              <div className="form-group">
                <label>Label</label>
                <input type="text" className="form-control" value="" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Copyright Owner</label>
                <input type="text" className="form-control" value="" />
                <p>The record company or composers if no record company</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Copyright Year</label>
                <input type="text" className="form-control" value="" />
                <p>The year that the song was written</p>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Audio ISRC Code</label>
                <input type="text" className="form-control" value="" />
                <p>Leave blank and we'll assign one for you</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Video ISRC Code</label>
                <input type="text" className="form-control" value="" />
                <p>Leave blank and we'll assign one for you</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-10">
              <div className="form-group">
                <label>Tags</label>
                <input type="text" className="form-control" value="" />
                <p>Separate each artist or band with a comma</p>
              </div>
            </div>
          </div>

          <div className="row mb6">
            <div className="col-md-10">
              <div className="form-group">
                <label>Comments or Short Description</label>
                <textarea type="text" className="form-control"></textarea>
                <p>Enter a short description about this song.</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Custom Field 1</label>
                <div className="input-group">
                  <input type="text" className="form-control" value="" />
                  <span className="input-group-addon" id="sizing-addon1">
                    <a href="#" className="btn muted btn-link btn-lg pr0-imp pl0-imp pt0-imp pb0-imp"><span className="rubix-icon icon-feather-circle-minus"></span></a>
                  </span>
                </div>
              </div>
              <p>Helper text if needed</p>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Custom Field 1</label>
                <div className="input-group">
                  <input type="text" className="form-control" value="" />
                  <span className="input-group-addon" id="sizing-addon1">
                    <a href="#" className="btn muted btn-link btn-lg pr0-imp pl0-imp pt0-imp pb0-imp"><span className="rubix-icon icon-feather-circle-minus"></span></a>
                  </span>
                </div>
              </div>
              <p>Helper text if needed</p>
            </div>
          </div>


          <div className="row">
            <div className="col-md-12">
              <h3>
                <span className="rubix-icon icon-feather-circle-plus mr1"></span>
                Add custom field
              </h3>
            </div>

            <div className="col-md-4 col-lg-2">
              <p>
                <a className="btn btn-lg btn-block btn-sq btn-primary" href="#">Save</a>
              </p>
            </div>
            <div className="col-md-8 col-lg-10">
              <p className="pt2">(You have unsaved changes)</p>
            </div>
          </div>



          <div className="body-sidebar__element">
            <h4>Quick Access</h4>
            <p>In this section you can easily import or export your metadata. You can even create metadata templates.</p>

            <p><a href="#">Import metadata</a></p>
            <p><a href="#">Export metadata</a></p>
            <p><a href="#">Save as template</a></p>
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
