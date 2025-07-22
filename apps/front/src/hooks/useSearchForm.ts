import { useState } from "react";

interface BaseItem {
    id: string;
}

export const useSearchForm = <T extends BaseItem>() => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(null);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        setSearchQuery(searchText);
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const clearSearch = () => {
        setSearchText("");
        setSearchQuery("");
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const openModal = () => {
        setEditingItem(null);
        setIsModalVisible(true);
    };

    const openEditModal = (item: T) => {
        setEditingItem(item);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setEditingItem(null);
    };

    return {
        isModalVisible,
        editingItem,
        pagination,
        searchText,
        searchQuery,
        openModal,
        openEditModal,
        closeModal,
        setPagination,
        setSearchText,
        handleSearch,
        clearSearch,
    };
};
