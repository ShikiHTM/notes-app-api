import type React from "react";
import NoteGrid from "../../components/ui/NoteGrid.ui";
import { MdCreate } from "react-icons/md";
import { CreateButton } from "../../components/ui/CreateButton.ui";

const NotesPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-slate-800">Ghi chú</h1>
            <NoteGrid notes={[
                {
                    id: 1,
                    title: "Ghi chú đầu tiên",
                    content: "Đây là nội dung của ghi chú đầu tiên.",
                    color: "#FFFFFF",
                    created_at: "2026-05-01T10:00:00Z",
                    updated_at: "2026-05-01T10:00:00Z",
                },
                {
                    id: 2,
                    title: "Ghi chú thứ hai",
                    content: "Nội dung của ghi chú thứ hai. Bạn có thể sử dụng nó để ghi lại ý tưởng, danh sách việc cần làm, hoặc bất cứ điều gì bạn muốn nhớ.",
                    created_at: "2026-05-02T08:30:00Z",
                    updated_at: "2026-05-02T08:30:00Z",
                }
            ]} emptyMessage="Chưa có ghi chú nào" variant={"notes"} actionsContext="notes" />

            <CreateButton
                onClick={() => alert("Tạo ghi chú mới")}
                icon={<MdCreate size={24}/>}
            />
        </div>
    );
};

export default NotesPage;
