import React, {useEffect, useState} from 'react';
import UppyCore from '@uppy/core';
import FileInput from '@uppy/file-input';
import XHRUpload from '@uppy/xhr-upload';
import ProgressBar from '@uppy/progress-bar';

const Uppy = ({uploadDone = () => null}) => {
    const [showFallback, setShowFallback]  = useState(false);
    useEffect(() => {
        try{
            const uppy = new UppyCore({ debug: true, autoProceed: true });
            uppy.use(FileInput, { target: '.UppyForm'});
            uppy.use(XHRUpload, {
                endpoint: '/upload',
                formData: true,
                fieldName: 'uploadedFile'
            });
            uppy.use(ProgressBar, {
                target: 'body',
                fixed: true,
                hideAfterFinish: true
            });
            uppy.on('complete', (result) => {
                console.log('successful files:', result.successful);
                console.log('failed files:', result.failed);
                uploadDone(result)
            })
        }catch (e) {
            setShowFallback(true);
        }
    }, []);

    return (
            <div className="UppyForm">
                {showFallback && <form action="/upload">
                    <h5>Uppy was not loaded — slow connection, unsupported browser, weird JS error on a page — but the
                        upload still works, because HTML is cool like that</h5>
                    <input type="file" name="uploadedFile" multiple=""/>
                    <button type="submit">Fallback Form Upload</button>
                </form>}
            </div>
    );
}

export default Uppy;
