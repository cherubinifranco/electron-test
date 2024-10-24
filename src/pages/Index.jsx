import { useEffect, useState } from "react";
import {
  getFile,
  sendMails,
  loadTemplateDataFromXlsx,
  addAudit,
  sendTestMail,
} from "../utils";
import FormItem from "../components/FormItem";
import MailsTable from "../components/MailsTable";
import ModalSimple from "../components/ModalSimple";

import { FileIcon, DatabaseIcon, CloudIcon } from "../components/Icons";

const TYPES = {
  SUCCESS: "success",
  WARNING: "warning",
  LOADING: "loading",
};

export default function IndexPage() {
  const [totalSended, updateTotalSended] = useState(0);
  const [mailConfig, updateMailConfig] = useState({});
  const [clientErrors, updateClientErrors] = useState(() => []);
  const [sendedMails, updateSendedMails] = useState(() => []);
  const [xlsxFile, updateXlsxFile] = useState(() => "");
  const [files, updateFiles] = useState(() => []);
  const [showModal, updateModal] = useState(false);
  const [content, updateContent] = useState(<></>);
  const [modalType, updateModalType] = useState("warning");

  useEffect(() => {
    const totalSendedLS = JSON.parse(localStorage.getItem("totalSended")) ?? 0;
    const mailConfigLS = JSON.parse(localStorage.getItem("mailConfig")) || {};
    const clientErrorsLS =
      JSON.parse(localStorage.getItem("clientErrorsComunicado")) || [];
    const sendedMailsLS =
      JSON.parse(localStorage.getItem("sendedMailsComunicado")) || [];
    const xlsxFileLS = localStorage.getItem("xlsxFile") || "";
    const filesLS = JSON.parse(localStorage.getItem("files")) || [];
    updateFiles(filesLS);
    updateXlsxFile(xlsxFileLS);
    updateMailConfig(mailConfigLS);
    updateTotalSended(totalSendedLS);
    updateClientErrors(clientErrorsLS);
    updateSendedMails(sendedMailsLS);
  }, []);

  const toggleModal = (title, type) => {
    updateContent(title);
    updateModalType(type);
    updateModal(true);
  };

  async function addFile() {
    const path = await getFile();
    if (!path) return;
    const filename = path.split("\\").reverse()[0];
    const obj = { filename, path };
    const newFiles = [...files, obj];
    localStorage.setItem("files", JSON.stringify(newFiles));
    updateFiles(newFiles);
  }

  async function deteleFile(event, index) {
    const newFiles = [...files.slice(0, index), ...files.slice(index + 1)];
    localStorage.setItem("files", JSON.stringify(newFiles));
    updateFiles(newFiles);
  }

  async function updateXLSX() {
    const path = await getFile();
    localStorage.setItem("xlsxFile", path);
    updateXlsxFile(path);
    if (path) {
      const data = await loadTemplateDataFromXlsx(path);
      if (data) {
        localStorage.setItem("templateData", JSON.stringify(data[1]));
      }
    }
  }

  async function submitMails(event) {
    event.preventDefault();

    const title = localStorage.getItem("titleToSend");
    const message = localStorage.getItem("msjeToSend");

    const mailInfo = {
      xlsxFile,
      mailConfig,
      title,
      message,
      files,
    };

    toggleModal("Se estan enviando los mails", TYPES.LOADING);

    const data = await sendMails(mailInfo);

    if (typeof data == "string") {
      toggleModal(data, TYPES.WARNING);
      return;
    }
    const [errors, sendedMails] = data;
    updateClientErrors(errors);
    updateSendedMails(sendedMails);
    updateTotalSended(totalSended + sendedMails.length);
    localStorage.setItem("clientErrorsComunicado", JSON.stringify(errors));
    localStorage.setItem("sendedMailsComunicado", JSON.stringify(sendedMails));
    toggleModal("Se enviaron con exito los mails", TYPES.SUCCESS);
    addAudit({
      title: "Envio de Comunicados",
      body: `Envio con ${sendedMails.length} resultados positivos y ${errors.length} resultados negativos`,
      extra: errors,
    });
  }

  return (
    <main className="text-white w-[700px] flex flex-col gap-3">
      <div className="flex flex-row justify-around mt-6">
        <a
          href="#/configuracion"
          className="bg-content p-6 rounded-lg font-semibold hover:bg-extracontent cursor-pointer"
        >
          Configuración
        </a>
        <a
          href="#/auditoria"
          className="bg-content p-6 rounded-lg font-semibold hover:bg-extracontent cursor-pointer"
        >
          Ultimos Movimientos
        </a>
        <p className="bg-content p-6 rounded-lg font-semibold">
          Total de
          <span className="p-4 text-accent bg-extracontent rounded-lg m-4">
            {totalSended}
          </span>
          Mails Enviados
        </p>
      </div>
      <form
        className="flex flex-col w-[700px] gap-3"
        id="form"
        onSubmit={submitMails}
      >
        <FormItem title="XLSX File" function={updateXLSX} value={xlsxFile}>
          {DatabaseIcon}
        </FormItem>

        <div className="flex items-center justify-center w-full">
          <button
            type="button"
            onClick={() => addFile()}
            className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-lg cursor-pointer dark:hover:bg-extra bg-extracontent border-border hover:border-gray-500 hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {CloudIcon}
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold">
                  Click para cargar archivos
                </span>
              </p>
            </div>
          </button>
        </div>
        <div className="w-full flex gap-3 flex-wrap pl-3 ml-5">
          {files.map((file, index) => (
            <div
              key={index}
              className="group relative w-24 px-2 h-16 border border-border rounded-lg group text-gray-300"
            >
              <button
                onClick={() => deteleFile(event, index)}
                type="button"
                className="absolute translate-y-4 -top-3 -right-1 opacity-0 bg-red-500 w-5 h-5 rounded-lg text-xs transition-all duration-200 group-hover:translate-y-2 group-hover:opacity-100 focus-within:translate-y-2 focus-within:opacity-100"
              >
                X
              </button>
              {FileIcon}
              <h1 className="truncate text-center hover:text-clip hover:overflow-visible">
                {file.filename}
              </h1>
            </div>
          ))}
        </div>
        <div className="flex justify-around gap-2">
          <a
            href="#/mensajes"
            className="w-full py-2.5 px-5 text-center text-sm font-bold rounded-lg bg-extra text-mainbg text-slate-200 hover:bg-accent"
          >
            Editar Mensaje
          </a>
          <button
            type="submit"
            className="w-full py-2.5 px-5 text-sm font-bold rounded-lg bg-accent2 text-mainbg text-white hover:bg-accent"
          >
            Enviar
          </button>
        </div>
      </form>
      <MailsTable array={clientErrors} />
      <MailsTable array={sendedMails} />

      {showModal && (
        <ModalSimple title={content} onExit={updateModal} type={modalType} />
      )}
    </main>
  );
}
