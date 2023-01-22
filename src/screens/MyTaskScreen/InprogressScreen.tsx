import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"
import { normalize } from "@rneui/themed"
import React, { useEffect, useState } from "react"
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import { font, image } from "../../assets"
import colors from "../../assets/colors/colors"
import { CardTask } from "../../components/Mytask/CardTask"
import { Filter } from "../../components/Mytask/Filter"
import { StatusFilterInprogress } from "../../components/Mytask/StatusFilterInprogress"

import { EmptyTask } from "../../components/TaskDetail/emptyTask"
import { MyJobDatasource } from "../../datasource/MyJobDatasource"
import { SearchMyJobsEntites } from "../../entites/SearchMyJobsEntites"

const InprogressScreen: React.FC<any> = ({ }) => {
    const [taskList, setTaskList] = useState([]);
    const [selectedField, setSelectedField] = useState({
        'name': 'ใกล้ถึงวันงาน',
        'value': 'coming_task',
        'direction': ''
    });
    const [selectedStatus, setSelectedStatus] = useState({
        'name': 'สถานะทั้งหมด',
        'value': 'ALL'
    });


    const getTaskList = async () => {
        const farmer_id = await AsyncStorage.getItem('farmer_id');
        const params: SearchMyJobsEntites = {
            farmerId: farmer_id,
            stepTab: "0",
            sortField: selectedField.value,
            sortDirection: selectedField.direction,
            filterStatus: selectedStatus.value
        }
        MyJobDatasource.getMyJobsList(params)
            .then((res) => {
                setTaskList(res)
            }).catch(err => console.log(err));


    }

    useEffect(() => {
        getTaskList()
    }, [selectedField, selectedStatus])

    useFocusEffect(
        React.useCallback(() => {
            getTaskList()

        }, []),
    );

    return (

        <>
            {taskList.length > 0 ?
                <View style={{ flex: 1, paddingHorizontal: normalize(10), backgroundColor: colors.grayBg }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: normalize(10) }}>
                        <Filter selectedField={selectedField} setSelectedField={setSelectedField} />
                        <StatusFilterInprogress selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
                    </View>
                    <View >
                        <FlatList
                            data={taskList}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity key={index} >
                                    <CardTask task={item} />
                                </TouchableOpacity>

                            )}

                        />

                    </View>
                </View>
                :
                <EmptyTask />
            }
        </>

    )
}

export default InprogressScreen