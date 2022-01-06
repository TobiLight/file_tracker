import InboxOutlined from '@ant-design/icons/lib/icons/InboxOutlined';
import { Form, message, Modal, Upload, } from 'antd';

interface IUploadModal {
    modalText: string
    visible: boolean
    confirmLoading: boolean
    handleCancel: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void | undefined
    handleOk: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void | undefined
}

export const UploadModal = ({ visible, handleCancel, handleOk, confirmLoading, modalText }: IUploadModal): JSX.Element => {
    const props = {
        name: 'file',
        multiple: true,
        action: '',
        onChange(info: any) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e: { dataTransfer: { files: any; }; }) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
        },
    };

    return (
        <>

            <Modal
                title="Upload files"
                centered
                okText="Done"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Form>
                    <Form.Item>
                        <Upload.Dragger
                            {...props}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                band files
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}