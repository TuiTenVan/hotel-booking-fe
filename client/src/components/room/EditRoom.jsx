import React, { useEffect, useState } from 'react';
import {getExtraService, getRoomById, updateRoom} from '../utils/ApiFunctions';
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
    message, Select
} from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const EditRoom = () => {
    const [form] = Form.useForm();
    const [room, setRoom] = useState({});
    const [imagePreview, setImagePreview] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { roomId } = useParams();
    const [serviceOptions, setServiceOptions] = useState([]);

    const fetchServices = async () => {
        try {
            const services = await getExtraService();
            // console.log("Fetched services:", services);
            const options = services.map(service => ({
                label: service.serviceName,
                value: service.id,
            }));
            setServiceOptions(options);
        } catch (error) {
            message.error("Failed to load extra services");
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleImageChange = (info) => {
        const file = info.file.originFileObj;
        if (file) {
            setRoom((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (values) => {
        const image = room.image;

        const roomRequest = {
            ...values,
            serviceIds: values.services,
            active: 1,
        };

        try {
            const success = await updateRoom(roomId, image, roomRequest);
            if (success.status === 200) {
                setSuccessMessage('Room updated successfully!');
                const updatedRoom = await getRoomById(roomId);
                console.log('Updated Room:', updatedRoom);
                setRoom(updatedRoom);
                setImagePreview(updatedRoom.image);
                message.success('Room updated!');
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
                console.log('Fetched Room Data:', roomData);
                setRoom(roomData);
                setImagePreview(roomData.image);

                form.setFieldsValue({
                    roomType: roomData.roomType,
                    roomName: roomData.roomName,
                    description: roomData.description,
                    roomNumber: roomData.roomNumber,
                    capacity: roomData.capacity,
                    quantity: roomData.quantity,
                    roomPrice: roomData.roomPrice,
                    services: roomData.services?.map(service => service.id) || []
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
                <Alert message={successMessage} type='success' showIcon style={{ marginBottom: 16 }} />
            )}
            {errorMessage && (
                <Alert message={errorMessage} type='error' showIcon style={{ marginBottom: 16 }} />
            )}

            <Form layout='vertical' form={form} onFinish={handleSubmit}>
                <Form.Item label='Room Type' name='roomType' rules={[{ required: true }]}>
                    <Select
                        options={[
                            { value: 'SINGLE', label: 'Single Room' },
                            { value: 'DOUBLE', label: 'Double Room' },
                            { value: 'SUITE', label: 'Suite' },
                            { value: 'DELUXE', label: 'Deluxe' },
                        ]}
                    />
                </Form.Item>

                <Form.Item label='Description' name='description' rules={[{ required: true }]}>
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item label='Capacity' name='capacity' rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} min={1} />
                </Form.Item>

                <Form.Item label='Quantity' name='quantity' rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} min={1} />
                </Form.Item>

                <Form.Item label='Services' name='services' rules={[{ required: true }]}>
                    <Select
                        mode='multiple'
                        placeholder='Select services'
                        value={form.getFieldValue('services')}
                        onChange={(value) => form.setFieldsValue({ services: value })}
                    >
                        {serviceOptions.map(service => (
                            <Select.Option key={service.value} value={service.value}>
                                {`${service.label}`}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label='Room Price' name='roomPrice' rules={[{ required: true }]}>
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
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
                        <Button type='primary' htmlType='submit'>Update</Button>
                        <Link to='/rooms'>
                            <Button icon={<ArrowLeftOutlined />} danger>Cancel</Button>
                        </Link>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};
