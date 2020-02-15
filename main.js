Array.prototype.pick = function() {
  const i = Math.floor(Math.random() * this.length);
  return this[i];
};

let expectedState = {};
let actualState = {};

function populatePanels(expectedPanel, actualPanel, n) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const populatePanel = panel => {
    while (panel.childNodes.length > 0) {
      panel.removeChild(panel.childNodes[panel.childNodes.length - 1]);
    }
    for (let i = 0; i < n; ++i) {
      const element = document.createElement('div');
      element.innerText = alphabet[i];
      element.classList += 'tile';
      panel.appendChild(element);
    }
  }

  populatePanel(expectedPanel);
  populatePanel(actualPanel);
}

function initialize() {
  const randomizeButton = document.getElementById('randomize-button');
  const expectedPanel = document.getElementById('expected');
  const actualPanel = document.getElementById('actual');
  const panelsRoot = document.getElementById('panels-root');
  const flexDirectionInput = document.getElementById('flex-direction-input');
  const justifyContentInput = document.getElementById('justify-content-input');
  const alignItemsInput = document.getElementById('align-items-input');
  const flexWrapInput = document.getElementById('flex-wrap-input');
  const alignContentInput = document.getElementById('align-content-input');
  const isRightCheckbox = document.getElementById('is-right-checkbox');

  const includeReverseCheckbox = document.getElementById('include-reverse-checkbox');
  const includeWrapCheckbox = document.getElementById('include-wrap-checkbox');

  const flexWrapLabel = document.getElementById('flex-wrap-label');
  const alignContentLabel = document.getElementById('align-content-label');

  const flexDirectionWithoutReverseOptions = ['row', 'column'];
  const flexDirectionWithReverseOptions = ['row', 'column', 'row-reverse', 'column-reverse'];
  const justifyContentOptions = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'];
  const alignItemsOptions = ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'];
  const flexWrapOptions = ['nowrap', 'wrap', 'wrap-reverse'];
  const alignContentOptions = ['flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly'];

  let flexDirectionOptions = flexDirectionWithoutReverseOptions;

  actualPanel.style['flex-direction'] = 'row';
  actualPanel.style['align-items'] = 'stretch';
  actualPanel.style['justify-content'] = 'flex-start';
  actualPanel.style['flex-wrap'] = 'nowrap';
  actualPanel.style['align-content'] = 'stretch';

  includeReverseCheckbox.addEventListener('change', () => {
    if (includeReverseCheckbox.checked) {
      flexDirectionOptions.splice(0, flexDirectionOptions.length, ...flexDirectionWithReverseOptions);
    } else {
      flexDirectionOptions.splice(0, flexDirectionOptions.length, ...flexDirectionWithoutReverseOptions);
    }
  });

  const reload = (mode, n) => {
    flexWrapInput.style.display = mode;
    alignContentInput.style.display = mode;
    flexWrapLabel.style.display = mode;
    alignContentLabel.style.display = mode;
    populatePanels(expectedPanel, actualPanel, n);
  }

  includeWrapCheckbox.addEventListener('change', () => {
    if (includeWrapCheckbox.checked) {
      reload('inline', 26);
    } else {
      actualPanel.style['flex-wrap'] = 'nowrap';
      reload('none', 4);
    }
  });

  reload('none', 4);

  randomizeButton.addEventListener('click', () => {
    expectedState = {
      'justify-content': justifyContentOptions.pick(),
      'align-items': alignItemsOptions.pick(),
      'flex-direction': flexDirectionOptions.pick(),
    };

    if (includeWrapCheckbox.checked) {
      expectedState['flex-wrap'] = flexWrapOptions.pick();
      if (expectedState['flex-wrap'] === 'nowrap') {
        expectedState['justify-content'] = 'flex-start';
        expectedState['align-content'] = 'stretch';
      } else {
        expectedState['align-content'] = alignContentOptions.pick();
      }
    } else {
      expectedState['flex-wrap'] = 'nowrap';
      expectedState['align-content'] = 'stretch';
    }

    expectedPanel.style['flex-direction'] = expectedState['flex-direction'];
    expectedPanel.style['justify-content'] = (expectedState['justify-content'] === 'center' ? 'safe ' : '') + expectedState['justify-content'];
    expectedPanel.style['align-items'] = (expectedState['align-items'] === 'center' ? 'safe ' : '') + expectedState['align-items'];
    expectedPanel.style['flex-wrap'] = expectedState['flex-wrap'];
    expectedPanel.style['align-content'] = expectedState['align-content'];

    panelsRoot.style['flex-direction'] = expectedState['flex-direction'].startsWith('row') ? 'column' : 'row';
    isRightCheckbox.checked = isRight();
  });

  const initialStyle = getComputedStyle(actualPanel);
  actualState = {
    'flex-direction': initialStyle['flex-direction'],
    'justify-content': initialStyle['justify-content'],
    'align-items': initialStyle['align-items'],
    'flex-wrap': initialStyle['flex-wrap'],
    'align-content': initialStyle['align-content'],
  };
  flexDirectionInput.value = actualState['flex-direction'];
  justifyContentInput.value = actualState['justify-content'];
  alignItemsInput.value = actualState['align-items'];
  flexWrapInput.value = actualState['flex-wrap'];
  alignContentInput.value = actualState['align-content'];

  const registerListener = (input, property, options) => {
    input.addEventListener('input', () => {
      actualState[property] = input.value;
      if (options.includes(actualState[property])) {
        let prefix = '';
        if ((property === 'align-items' || property === 'justify-content') && actualState[property] === 'center') {
          prefix = 'safe ';
        }
        actualPanel.style[property] = prefix + actualState[property];
      }
      isRightCheckbox.checked = isRight();
    });
  };

  registerListener(flexDirectionInput, 'flex-direction', flexDirectionOptions);
  registerListener(justifyContentInput, 'justify-content', justifyContentOptions);
  registerListener(alignItemsInput, 'align-items', alignItemsOptions);
  registerListener(flexWrapInput, 'flex-wrap', flexWrapOptions);
  registerListener(alignContentInput, 'align-content', alignContentOptions);
}

function isRight() {
  console.log("expectedState:", expectedState);
  console.log("actualState:", actualState);
  return expectedState['flex-direction'] === actualState['flex-direction'] &&
         expectedState['justify-content'] === actualState['justify-content'] &&
         expectedState['align-items'] === actualState['align-items'] &&
         expectedState['flex-wrap'] === actualState['flex-wrap'] &&
         expectedState['align-content'] === actualState['align-content'];
}

window.addEventListener('load', initialize);
