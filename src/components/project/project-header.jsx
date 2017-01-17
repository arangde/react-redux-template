import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import actions from '../../redux/actions';

import {
    SplitButton,
    MenuItem,
} from '@sketchpixy/rubix';

class ProjectHeader extends React.Component {
    constructor(...args) {
        super(...args);

        this.state = { edit: false, title: 'Untitled Project' };
    }

    componentWillMount() {
        const { project, status } = this.props;
        const projectTitle = project? project.title: 'Untitled Project';
        this.setState({title: projectTitle});
    }

    componentWillReceiveProps (nextProps) {
        const { project, status } = nextProps;
        const { router, dispatch } = this.props;
        const projectTitle = project? project.title: 'Untitled Project';

        if(status != 'saving') {
            this.setState({title: projectTitle});
        }

        if(status == 'deleted') {
            // dispatch(actions.removeVideo(project.id));
            router.push('/videos');
        }
        else if(status == 'saved') {
            this.setState({edit: false});
        }
    }

    deleteProject() {
        const { dispatch, project } = this.props;
        if(project) {
            if(confirm("Are you sure to delete this video project?")) {
                dispatch(actions.deleteProject(project.id));
            }
        }
    }

    saveAndExit() {
        const { router } = this.props;
        router.push('/videos');
    }

    editTitle(e) {
        e.preventDefault();
        this.setState({edit: true});

    }

    cancelEdit() {
        this.setState({edit: false});
    }

    changeTitle(e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            const { dispatch, project } = this.props;

            let projectTitle = ReactDOM.findDOMNode(this.projectTitle).value;
            this.setState({edit: false, title: projectTitle});

            if(project)
                dispatch(actions.editProject(project.id, projectTitle));
            else
                dispatch(actions.createProject(projectTitle));
        }
    }

    buildVideo() {
        const { router, dispatch } = this.props;

        dispatch(actions.checkBuilding());
        router.push('/popup/loading');
    }

    render() {
        const { edit, title } = this.state;
        const headerTitle = edit ?
            <h2><input type="text" name="projectTitle" id="projectTitleHidden" ref={(ref) => this.projectTitle = ref}
                defaultValue={ title } onKeyPress={ ::this.changeTitle } onBlur={::this.cancelEdit} autoFocus/></h2> :
            <h2><span id="projectTitle">{ title }</span>
                <span onClick={ ::this.editTitle } className="rubix-icon icon-outlined-pencil"></span></h2>;

        return (
            <div id="body-header">
                <div className="pull-right project-actions">
                    <a href="javascript:;" onClick={::this.buildVideo} className="project-action">Generate Video</a>
                    <a href="javascript:;" onClick={::this.deleteProject} className="project-action">Delete Project</a>
                </div>
                { headerTitle }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    status: state.project.status,
    project: state.project.project
});

export default connect(mapStateToProps)(ProjectHeader);
