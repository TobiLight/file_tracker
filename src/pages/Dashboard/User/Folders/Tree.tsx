import { Tree } from "antd";
import { DownOutlined } from '@ant-design/icons';

export const FolderTree = (): JSX.Element => {
    const onSelect = (selectedKeys: any, info: any) => {
        console.log('selected', selectedKeys, info);
    };
    return (
        <Tree
            showLine
            switcherIcon={<DownOutlined />}
            defaultExpandedKeys={['0-0-0']}
            onSelect={onSelect}
            treeData={[
                {
                    title: 'Root',
                    key: '0-0',
                    children: [
                        {
                            title: 'Dir 1',
                            key: '0-0-0',
                            children: [
                                {
                                    title: 'leaf',
                                    key: '0-0-0-0',
                                },
                                {
                                    title: 'leaf',
                                    key: '0-0-0-1',
                                },
                                {
                                    title: 'leaf',
                                    key: '0-0-0-2',
                                },
                            ],
                        },
                        {
                            title: 'Dir2',
                            key: '0-0-1',
                            children: [
                                {
                                    title: 'leaf',
                                    key: '0-0-1-0',
                                },
                            ],
                        },
                        {
                            title: 'parent 1-2',
                            key: '0-0-2',
                            children: [
                                {
                                    title: 'leaf',
                                    key: '0-0-2-0',
                                },
                                {
                                    title: 'leaf',
                                    key: '0-0-2-1',
                                },
                            ],
                        },
                    ],
                },
            ]}
        />
    )
}