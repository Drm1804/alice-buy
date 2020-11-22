const fetch = require("node-fetch");

module.exports.handler = async (event, context) => {
  const { version, session, request } = event;
  let text = "";
  const welcome_text = "Скажи что купить и я внесу это в список";

  if (request["original_utterance"].length) {
    addChecklistItem(request["original_utterance"]);
    text = responseTextCreator(request["original_utterance"], true);
  } else {
    text = responseTextCreator(welcome_text, false);
  }

  return response(version, session, text, false);
};

async function addChecklistItem(text) {
  const query = [
    `name=${encodeURI(text)}`,
    `key=${process.env.key}`,
    `token=${process.env.token}`,
  ].join("&");

  const reqString =
    "https://api.trello.com/1/checklists/" +
    process.env.checklistId +
    "/checkItems/?" +
    query;

  await fetch(reqString, {
    method: "POST",
  });
}

function responseTextCreator(text, isAdding) {
  return isAdding ? `Добавила — ${text}` : text;
}

function response(version, session, text, isFinish) {
  return {
    version,
    session,
    response: {
      text,
      end_session: isFinish,
    },
  };
}