const statusEl = document.getElementById("status")

function setStatus(msg) {
  statusEl.textContent = msg
}

document.getElementById("start").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "ATTACH" }, () => {
    setStatus("Capturing started. Browse the page, then click Refresh.")
  })
})

document.getElementById("refresh").addEventListener("click", () => {
  chrome.runtime.sendMessage(
    { type: "GET_REQUESTS" },
    response => {
      if (response && response.data) {
        renderTable(response.data)
        setStatus(`${response.data.length} request(s) captured.`)
      }
    }
  )
})

document.getElementById("clear").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "CLEAR_REQUESTS" }, () => {
    document.getElementById("apiTable").innerHTML = ""
    setStatus("Cleared.")
  })
})

document.getElementById("export").addEventListener("click", () => {
  chrome.runtime.sendMessage(
    { type: "GET_REQUESTS" },
    response => {
      if (response && response.data) {
        const blob = new Blob(
          [JSON.stringify(response.data, null, 2)],
          { type: "application/json" }
        )
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "api-calls.json"
        a.click()
        URL.revokeObjectURL(url)
      }
    }
  )
})

function renderTable(data) {
  const table = document.getElementById("apiTable")
  table.innerHTML = ""

  data.forEach(req => {
    const row = document.createElement("tr")

    const status = req.status || ""
    const isError = status >= 400
    if (isError) row.classList.add("error")

    let path = req.url
    try {
      path = new URL(req.url).pathname
    } catch (_) {}

    row.innerHTML = `
      <td>${req.method || ""}</td>
      <td title="${req.url}">${path}</td>
      <td>${status}</td>
      <td>${req.duration || ""}</td>
    `

    table.appendChild(row)
  })
}
