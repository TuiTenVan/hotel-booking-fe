import React, { useEffect, useState } from 'react';
import { getRoomById, updateRoom } from '../utils/ApiFunctions';
import { useParams, Link } from 'react-router-dom';
import {
    Form,
    Input,
    InputNumber,
    Upload,
    Button,
    Alert,
    Typography,
    Image,
    Space,
    message
} from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const EditRoom = () => {
    const [form] = Form.useForm();
    const [room, setRoom] = useState({
        image: null,
        roomType: '',
        roomPrice: ''
    });

    const [imagePreview, setImagePreview] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { roomId } = useParams();

    const handleImageChange = (info) => {
        const file = info.file.originFileObj;
        if (file) {
            setRoom({ ...room, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        try {
            const success = await updateRoom(roomId, room);
            if (success.status === 200) {
                setSuccessMessage('Room updated successfully!');
                const updatedRoom = await getRoomById(roomId);
                setRoom(updatedRoom);
                setImagePreview(updatedRoom.image);
                message.success('Room updated!');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to update room.');
                message.error('Error updating room');
            }
        } catch (err) {
            console.error(err);
            setErrorMessage(err.message || 'Unexpected error');
            message.error('Unexpected error');
        }

        setTimeout(() => {
            setSuccessMessage('');
            setErrorMessage('');
        }, 3000);
    };

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const roomData = await getRoomById(roomId);
                setRoom(roomData);
                setImagePreview(roomData.image);
                form.setFieldsValue({
                    roomType: roomData.roomType,
                    roomPrice: roomData.roomPrice
                });
            } catch (err) {
                console.error(err);
                message.error('Failed to load room');
            }
        };

        fetchRoom();
    }, [roomId, form]);

    return (
        <div style={{ maxWidth: 600, margin: '60px auto' }}>
            <Title level={3} style={{ textAlign: 'center', marginBottom: 30 }}>
                Update Room
            </Title>

            {successMessage && (
                <Alert
                    message={successMessage}
                    type='success'
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}
            {errorMessage && (
                <Alert
                    message={errorMessage}
                    type='error'
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            <Form layout='vertical' form={form} onFinish={handleSubmit}>
                <Form.Item
                    label='Room Type'
                    name='roomType'
                    rules={[{ required: true, message: 'Please input room type!' }]}
                >
                    <Input
                        name='roomType'
                        placeholder='e.g. SUITE'
                        onChange={(e) => setRoom({ ...room, roomType: e.target.value })}
                    />
                </Form.Item>

                <Form.Item
                    label='Room Price'
                    name='roomPrice'
                    rules={[{ required: true, message: 'Please input room price!' }]}
                >
                    <InputNumber
                        name='roomPrice'
                        min={0}
                        style={{ width: '100%' }}
                        placeholder='e.g. 150000'
                        onChange={(value) => setRoom({ ...room, roomPrice: value })}
                    />
                </Form.Item>

                <Form.Item
                    label='Image'
                    name='image'
                    rules={imagePreview ? [] : [{ required: true, message: 'Please upload an image!' }]}
                >
                    <Upload
                        accept='image/*'
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={handleImageChange}
                    >
                        <Button icon={<UploadOutlined />}>Choose Image</Button>
                    </Upload>
                    {imagePreview && (
                        <Image
                            src={
                                imagePreview.startsWith('data:image')
                                    ? imagePreview
                                    : `data:image/*;base64,${imagePreview}`
                            }
                            alt='Room Preview'
                            style={{ marginTop: 16, maxHeight: 300 }}
                        />
                    )}
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type='primary' htmlType='submit'>
                            Update
                        </Button>
                        <Link to='/rooms'>
                            <Button icon={<ArrowLeftOutlined />} danger>
                                Cancel
                            </Button>
                        </Link>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};
