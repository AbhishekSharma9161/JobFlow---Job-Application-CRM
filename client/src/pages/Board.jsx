import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useApplicationStore } from "../store/applicationStore";
import ApplicationCard from "../components/applications/ApplicationCard";
import ApplicationModal from "../components/applications/ApplicationModal";
import { STATUS_COLORS, ALL_STATUSES } from "../utils/statusColors";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";

const COLLAPSED_BY_DEFAULT = ["Rejected", "Ghosted", "Withdrawn"];

export default function Board() {
  const { applications, fetchApplications, updateStatus } = useApplicationStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [collapsed, setCollapsed] = useState(
    Object.fromEntries(COLLAPSED_BY_DEFAULT.map((s) => [s, true]))
  );

  useEffect(() => { fetchApplications(); }, []);

  const columns = ALL_STATUSES.map((status) => ({
    status,
    items: applications.filter((a) => a.status === status),
  }));

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    updateStatus(draggableId, destination.droppableId);
  };

  const toggleCollapse = (status) =>
    setCollapsed((c) => ({ ...c, [status]: !c[status] }));

  const openEdit = (app) => { setEditData(app); setModalOpen(true); };
  const openAdd = () => { setEditData(null); setModalOpen(true); };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] bg-[var(--surface)]">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text)]">Kanban Board</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Drag cards to update status</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text)]">{applications.length}</span> total
          </span>
          <button onClick={openAdd} className="btn-primary">
            <Plus size={15} /> Add
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-3 h-full p-5 w-max min-w-full">
            {columns.map(({ status, items }) => {
              const colors = STATUS_COLORS[status];
              const isCollapsed = collapsed[status];

              return (
                <div
                  key={status}
                  className={`flex flex-col bg-[var(--surface-2)] rounded-2xl border border-[var(--border)] transition-all duration-200 ${
                    isCollapsed ? "w-12" : "w-64"
                  }`}
                  style={{ minHeight: "calc(100vh - 180px)", maxHeight: "calc(100vh - 180px)" }}
                >
                  {/* Column header */}
                  <div
                    className={`flex items-center gap-2 p-3 cursor-pointer select-none ${isCollapsed ? "flex-col justify-center py-4" : "justify-between"}`}
                    onClick={() => toggleCollapse(status)}
                  >
                    {isCollapsed ? (
                      <>
                        <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                        <span
                          className="text-[10px] font-bold text-[var(--text-muted)] writing-mode-vertical"
                          style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
                        >
                          {status}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                          {items.length}
                        </span>
                        <ChevronRight size={12} className="text-[var(--text-muted)]" />
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colors.dot}`} />
                          <span className="font-bold text-sm text-[var(--text)] truncate">{status}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} flex-shrink-0`}>
                            {items.length}
                          </span>
                        </div>
                        <ChevronDown size={14} className="text-[var(--text-muted)] flex-shrink-0" />
                      </>
                    )}
                  </div>

                  {/* Droppable area */}
                  {!isCollapsed && (
                    <Droppable droppableId={status}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 overflow-y-auto px-2 pb-2 space-y-2 transition-colors rounded-b-2xl ${
                            snapshot.isDraggingOver ? "bg-brand-50 dark:bg-brand-900/10" : ""
                          }`}
                        >
                          {items.map((app, index) => (
                            <Draggable key={app._id} draggableId={app._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`transition-all ${snapshot.isDragging ? "rotate-1 scale-105 shadow-2xl" : ""}`}
                                >
                                  <ApplicationCard app={app} onEdit={openEdit} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}

                          {items.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <div className={`w-8 h-8 rounded-xl ${colors.bg} flex items-center justify-center mb-2`}>
                                <span className={`w-3 h-3 rounded-full ${colors.dot}`} />
                              </div>
                              <p className="text-xs text-[var(--text-muted)]">Drop here</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  )}
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      <ApplicationModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditData(null); }} editData={editData} />
    </div>
  );
}
