type Props = {
    onHide: () => void;
    show: boolean;
    onDelete: () => void;
}

function DeleteDialog({ onHide, show, onDelete }: Props) {
    const onClose = () => onHide();

    return (
        <>
            <div className="modal">
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Modal title</p>
                        <button className="delete" aria-label="close"></button>
                    </header>
                    <section className="modal-card-body">
                    </section>
                    <footer className="modal-card-foot">
                        <div className="buttons">
                            <button className="button is-success">Löschen</button>
                            <button className="button">Abbrechen</button>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}

export default DeleteDialog;