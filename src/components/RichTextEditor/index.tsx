import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor: React.FC<{ className?: string, value?: string, style?: React.CSSProperties, onChange?: () => void }> = (props) => {
    return (
        <ReactQuill theme="snow" className='editor' value={props.value} onChange={props.onChange} />
    );
}
export default RichTextEditor;
