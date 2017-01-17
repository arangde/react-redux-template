import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import cookie from 'react-cookie';

import actions from '../../redux/actions';

import {
    Button,
} from '@sketchpixy/rubix';

const trackSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index
        };
    },
    canDrag(props) {
        return props.drag;
    }
};

const trackTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        if (dragIndex === hoverIndex) {
            return;
        }

        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        props.moveTrack(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    },
    drop(props) {
        props.endDrop();
    }
};

@DropTarget("AudioTrack", trackTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))

@DragSource("AudioTrack", trackSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))

export default class AudioTrack extends React.Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired,
        id: PropTypes.any.isRequired,
        track: PropTypes.any.isRequired,
        drag: PropTypes.bool.isRequired,
        isDragging: PropTypes.bool.isRequired,
        enableDrag: PropTypes.func.isRequired,
        disableDrag: PropTypes.func.isRequired,
        moveTrack: PropTypes.func.isRequired,
        endDrop: PropTypes.func.isRequired,
        sendPlaying: PropTypes.func.isRequired,
        playing: PropTypes.bool.isRequired,
        allChecked: PropTypes.bool.isRequired,
        checkItem: PropTypes.func.isRequired,
    };

    constructor(...args) {
        super(...args);

        this.state = { playing: false, checked: false };
    }

    componentWillReceiveProps (nextProps) {
        const { playing, allChecked } = nextProps;
        this.setState({playing: playing});

        if(allChecked != this.props.allChecked) {
            this.setState({checked: allChecked});
        }
    }

    componentDidUpdate( prevProps, prevState ) {
        const { track, checkItem } = this.props;
        const audio = document.getElementById(`audio_track_${track.id}`);

        if(this.state.playing) {
            audio.play();
        }
        else {
            audio.pause();
        }

        checkItem(this.state.checked, track.id);
    }

    removeTrack() {
        if(confirm("Are you sure you want to delete this Project Track?")) {
            const { track, projectId, dispatch } = this.props;
            dispatch(actions.removeTrack(projectId, track.id));
        }
    }

    play() {
        const { track, sendPlaying } = this.props;

        if(this.state.playing) {
            this.setState({playing: false});
            sendPlaying(track, false);
        }
        else {
            this.setState({playing: true});
            sendPlaying(track, true);
        }
    }

    check(e) {
        this.setState({checked: e.target.checked});
    }

    render() {
        const { track, index, editor, drag, isDragging, enableDrag, disableDrag, connectDragSource, connectDropTarget } = this.props;
        const metadata = JSON.parse(track.metadata).length ? JSON.parse(track.metadata)[0]: {};
        const className = drag ? "drag-enable" : "";
        const opacity = isDragging ? 0 : 1;
        const iconClass = this.state.playing? 'color-primary rubix-icon icon-fontello-pause-1':
            'color-primary rubix-icon icon-fontello-play-1';

        let audio = null;
        if(track.audio_file)
            audio = <audio id={`audio_track_${track.id}`} loop><source src={track.audio_file} type="audio/mpeg" /></audio>;

        return connectDragSource(connectDropTarget(
            <tr style={{opacity}} className={className}>
                <td className="text-center"><input type="checkbox" onClick={::this.check} checked={this.state.checked}/></td>
                <td className="text-center">
                    <Button bsStyle="link" className="action-play" onClick={drag ? null: ::this.play}>
                        <span className={ iconClass }></span>
                    </Button>
                </td>
                <td className="text-center">{index + 1}{audio}</td>
                <td className="cell-title" onClick={drag ? null: editor}>{track.title ? track.title : '---- ----'}</td>
                <td className="cell-title" onClick={drag ? null: editor}>{track.subtitle? track.subtitle: '----'}</td>
                <td className="text-center">{metadata.duration? metadata.duration: '--'}</td>
                <td className="text-right">
                    <Button bsStyle="link" className="pl1-imp pr1-imp action-editor" onClick={editor}>
                        <span className="rubix-icon icon-outlined-pencil"></span>
                    </Button>
                    <Button bsStyle="link" className="pl1-imp pr1-imp action-drag-enable" onClick={enableDrag}>
                        <span className="rubix-icon icon-fontello-wrench-4"></span>
                    </Button>
                    <Button bsStyle="link" className="pl1-imp pr1-imp action-remove-track" onClick={::this.removeTrack}>
                        <span className="rubix-icon icon-outlined-trash-bin"></span>
                    </Button>
                    <Button bsStyle="link" className="pl1-imp pr1-imp action-drag-cancel" onClick={disableDrag}>
                        <span className="rubix-icon icon-fontello-cancel-5"></span>
                    </Button>
                </td>
            </tr>
        ));
    }
}
