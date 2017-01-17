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

          <h2>ANTI Album</h2>

        </div>
        <div className="body-sidebar__container">
          
          <div className="row">
            <div className="col-sm-12">
              <ul className="filters-list pull-right">
                <li><span className="rubix-icon icon-fontello-th"></span></li>
                <li className="active"><span className="rubix-icon icon-fontello-th-list"></span></li>
              </ul>
              <h3 className="header">
                <span className="ml2 mr2">Audio Manager</span>
              </h3>
            </div>
          </div>

          <table className="table track-listing">
            <thead>
              <tr>
                <td className="text-center">
                  &nbsp;
                </td>
                <td className="text-center">
                  #
                </td>
                <td>
                  TITLE
                </td>
                <td>
                  ARTIST
                </td>
                <td className="text-center">
                  TIME
                </td>
                <td className="text-center">
                  &nbsp;
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">
                  <span className="color-primary rubix-icon icon-fontello-play-1"></span>
                </td>
                <td className="text-center">
                  1
                </td>
                <td>
                  Consideration
                </td>
                <td>
                  Rhianna
                </td>
                <td className="text-center">
                  2:41
                </td>
                <td className="text-right">
                  <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-outlined-pencil"></span></button>
                  <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-fontello-wrench-4"></span></button>
                  <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-outlined-trash-bin"></span></button>
                </td>
              </tr>
              <tr>
                <td className="text-center">
                  <span className="muted rubix-icon icon-fontello-play-1"></span>
                </td>
                <td className="text-center">
                  2
                </td>
                <td>
                  Same Ol' Mistakes
                </td>
                <td>
                  Rhianna
                </td>
                <td className="text-center">
                  2:41
                </td>
                <td className="text-right">
                  <div className="dis-tbl">
                    <div className="dis-tbl-cell full">
                      <div className="mb0 progress progress-bar-striped time-progress">
                        <div className="progress-bar progress-bar-striped active" role="progressbar"></div>
                      </div>
                    </div>
                    <div className="dis-tbl-cell">
                      <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-ikons-close"></span></button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="playing">
                <td className="text-center">
                  <span className="color-primary rubix-icon icon-fontello-pause-1"></span>
                </td>
                <td className="text-center">
                  3
                </td>
                <td>
                  Kiss It Better
                </td>
                <td>
                  Rhianna
                </td>
                <td className="text-center">
                  2:41
                </td>
                <td className="text-right">
                  <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-outlined-pencil"></span></button>
                  <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-fontello-wrench-4"></span></button>
                  <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-outlined-trash-bin"></span></button>
                </td>
              </tr>
              <tr>
                <td className="text-center">
                  <span className="color-primary rubix-icon icon-fontello-play-1"></span>
                </td>
                <td className="text-center">
                  4
                </td>
                <td>
                  Love on the Brain
                </td>
                <td>
                  Rhianna
                </td>
                <td className="text-center">
                  2:41
                </td>
                <td className="text-right">
                  <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-outlined-pencil"></span></button>
                  <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-fontello-wrench-4"></span></button>
                  <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-outlined-trash-bin"></span></button>
                </td>
              </tr>
              <tr>
                <td className="text-center">
                  <span className="muted rubix-icon icon-fontello-play-1"></span>
                </td>
                <td className="text-center">
                  5
                </td>
                <td>
                  Consideration
                </td>
                <td>
                  Rhianna
                </td>
                <td className="text-center">
                  2:41
                </td>
                <td className="text-right">
                  <div className="dis-tbl">
                    <div className="dis-tbl-cell full">
                      <div className="mb0 progress progress-bar-striped time-progress">
                        <div className="progress-bar progress-bar-striped active" role="progressbar"></div>
                      </div>
                    </div>
                    <div className="dis-tbl-cell">
                      <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-ikons-close"></span></button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-center">
                  <span className="muted rubix-icon icon-fontello-play-1"></span>
                </td>
                <td className="text-center">
                  6
                </td>
                <td>
                  Same Ol' Mistakes
                </td>
                <td>
                  Rhianna
                </td>
                <td className="text-center">
                  2:41
                </td>
                <td className="text-right">
                  <div className="dis-tbl">
                    <div className="dis-tbl-cell full">
                      <div className="mb0 progress progress-bar-striped time-progress">
                        <div className="progress-bar progress-bar-striped active" role="progressbar"></div>
                      </div>
                    </div>
                    <div className="dis-tbl-cell">
                      <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-ikons-close"></span></button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-center">
                  <span className="color-primary rubix-icon icon-fontello-play-1"></span>
                </td>
                <td className="text-center">
                  7
                </td>
                <td>
                  Kiss It Better
                </td>
                <td>
                  Rhianna
                </td>
                <td className="text-center">
                  2:41
                </td>
                <td className="text-right">
                  <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-outlined-pencil"></span></button>
                  <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-fontello-wrench-4"></span></button>
                  <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-outlined-trash-bin"></span></button>
                </td>
              </tr>
              <tr>
                <td className="text-center">
                  <span className="color-primary rubix-icon icon-fontello-play-1"></span>
                </td>
                <td className="text-center">
                  8
                </td>
                <td>
                  Love on the Brain
                </td>
                <td>
                  Rhianna
                </td>
                <td className="text-center">
                  2:41
                </td>
                <td className="text-right">
                  <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-outlined-pencil"></span></button>
                  <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-fontello-wrench-4"></span></button>
                  <button className="btn btn-link pl1-imp pr1-imp"><span className="rubix-icon icon-outlined-trash-bin"></span></button>
                </td>
              </tr>
            </tbody>
          </table>

          <p>By uploading anything to ArtTracks, you hereby certify that you own the copyrights in or have all the necessary rights related to such content to upload it.</p>

          <div className="body-sidebar__element">
            <p className="text-center mt4"><span className="huge rubix-icon icon-outlined-cloud-upload"></span></p>
            <h4 className="text-center color-primary">Add Tracks</h4>
            <p className="text-center">Drag and drop audio tracks anywhere in this area to add them to your project.</p>
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
